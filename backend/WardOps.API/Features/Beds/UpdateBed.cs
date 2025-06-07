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

public static class UpdateBed
{
    public class Command : IRequest<BedResponse>
    {
        public Guid Id { get; set; }
        public string BedNumber { get; set; } = string.Empty;
        public BedStatus Status { get; set; }
        public string? Notes { get; set; }
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

            if (await _dbContext.Beds.AnyAsync(b => 
                b.WardId == bed.WardId && b.BedNumber == request.BedNumber && b.Id != request.Id, 
                cancellationToken))
            {
                throw new InvalidOperationException("Bed with the same number already exists in this ward.");
            }

            var previousStatus = bed.Status;
            
            bed.BedNumber = request.BedNumber;
            bed.Status = request.Status;
            bed.Notes = request.Notes;

            _dbContext.Update(bed);
            await _dbContext.SaveChangesAsync(cancellationToken);

            if (previousStatus != request.Status)
            {
                var bedEventLog = new BedEventLog
                {
                    Id = Guid.NewGuid(),
                    BedId = bed.Id,
                    EventType = BedEventType.StatusManuallyChanged,
                    Timestamp = DateTime.UtcNow,
                    Notes = $"Status changed from {previousStatus} to {request.Status}"
                };

                _dbContext.BedEventLogs.Add(bedEventLog);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }

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

public class UpdateBedEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("api/beds/{id}", async ([FromRoute] Guid id, [FromBody] UpdateBedRequest request, ISender sender, IValidator<UpdateBedRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new UpdateBed.Command
            {
                Id = id,
                BedNumber = request.BedNumber,
                Status = request.Status,
                Notes = request.Notes
            };

            var result = await sender.Send(command);

            return Results.Ok(result);
        })
        .WithTags("Beds")
        .WithName("UpdateBed")
        .WithDescription("Updates an existing bed")
        .Produces<BedResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}