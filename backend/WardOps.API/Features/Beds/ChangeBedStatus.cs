using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Beds;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;
using WardOps.API.Services;

namespace WardOps.API.Features.Beds;

public static class ChangeBedStatus
{
    public class Command : IRequest<BedResponse>
    {
        public Guid Id { get; set; }
        public BedStatus Status { get; set; }
        public string? Notes { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, BedResponse>
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;

        public Handler(ApplicationDbContext dbContext, ICurrentUserService currentUserService)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;
        }

        public async Task<BedResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            var bed = await _dbContext.Beds
                .Include(b => b.Ward)
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (bed == null)
            {
                throw new KeyNotFoundException("Bed not found.");
            }

            if (bed.Status == request.Status)
            {
                return new BedResponse
                {
                    Id = bed.Id,
                    WardId = bed.WardId,
                    WardNumber = bed.Ward.WardNumber,
                    BedNumber = bed.BedNumber,
                    Status = bed.Status,
                    Notes = bed.Notes
                };
            }

            var previousStatus = bed.Status;

            bed.Status = request.Status;
            bed.Notes = request.Notes;

            _dbContext.Update(bed);

            var userId = _currentUserService.GetCurrentUserId();
            var eventType = GetEventTypeForStatusChange(request.Status);

            var bedEventLog = new BedEventLog
            {
                Id = Guid.NewGuid(),
                BedId = bed.Id,
                EventType = eventType,
                Timestamp = DateTime.UtcNow,
                UserId = userId,
                Notes = request.Notes ?? $"Status changed from {previousStatus} to {request.Status}"
            };

            _dbContext.BedEventLogs.Add(bedEventLog);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new BedResponse
            {
                Id = bed.Id,
                WardId = bed.WardId,
                WardNumber = bed.Ward.WardNumber,
                BedNumber = bed.BedNumber,
                Status = bed.Status,
                Notes = bed.Notes
            };
        }

        private static BedEventType GetEventTypeForStatusChange(BedStatus newStatus) => newStatus switch
        {
            BedStatus.Cleaning => BedEventType.CleaningStarted,
            BedStatus.Maintenance => BedEventType.MaintenanceScheduled,
            BedStatus.Available => BedEventType.CleaningFinished,
            BedStatus.Reserved => BedEventType.ReservationCreated,
            _ => BedEventType.StatusManuallyChanged
        };
    }
}

public class ChangeBedStatusEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPatch("api/beds/{id}/status", async ([FromRoute] Guid id, [FromBody] ChangeBedStatusRequest request, ISender sender, IValidator<ChangeBedStatusRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new ChangeBedStatus.Command
            {
                Id = id,
                Status = request.Status,
                Notes = request.Notes
            };

            var result = await sender.Send(command);

            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithTags("Beds")
        .WithName("ChangeBedStatus")
        .WithDescription("Changes the status of a bed and logs the event")
        .Produces<BedResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}