using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Beds;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Beds;

public static class ChangeBedStatus
{
    public class Command : IRequest<BedResponse>
    {
        public Guid Id { get; set; }
        public BedStatus Status { get; set; }
        public string? UserId { get; set; }
        public string? Notes { get; set; }
        public BedEventType EventType { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, BedResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
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
            _dbContext.Update(bed);

            var bedEventLog = new BedEventLog
            {
                Id = Guid.NewGuid(),
                BedId = bed.Id,
                EventType = request.EventType,
                Timestamp = DateTime.UtcNow,
                UserId = request.UserId,
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
                Notes = request.Notes,
                EventType = BedEventType.StatusManuallyChanged
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