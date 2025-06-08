using Carter;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Beds;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Beds;

public static class CreateBed
{
    public class Command : IRequest<BedResponse>
    {
        public Guid WardId { get; set; }
        public string BedNumber { get; set; } = string.Empty;
        public BedStatus Status { get; set; } = BedStatus.Available;
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
            var ward = await _dbContext.Wards.FirstOrDefaultAsync(w => w.Id == request.WardId, cancellationToken);
            if (ward == null)
            {
                throw new KeyNotFoundException("Ward not found.");
            }

            if (await _dbContext.Beds.AnyAsync(b =>
                b.WardId == request.WardId && b.BedNumber == request.BedNumber,
                cancellationToken))
            {
                throw new InvalidOperationException("Bed with the same number already exists in this ward.");
            }

            var bed = new Bed
            {
                Id = Guid.NewGuid(),
                WardId = request.WardId,
                BedNumber = request.BedNumber,
                Status = request.Status,
                Notes = request.Notes
            };

            _dbContext.Add(bed);
            await _dbContext.SaveChangesAsync(cancellationToken);

            if (bed.Status != BedStatus.Available)
            {
                var bedEventLog = new BedEventLog
                {
                    Id = Guid.NewGuid(),
                    BedId = bed.Id,
                    EventType = BedEventType.StatusManuallyChanged,
                    Timestamp = DateTime.UtcNow,
                    Notes = $"Initial bed status set to {bed.Status}"
                };

                _dbContext.BedEventLogs.Add(bedEventLog);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }

            return new BedResponse
            {
                Id = bed.Id,
                WardId = bed.WardId,
                WardNumber = ward.WardNumber,
                BedNumber = bed.BedNumber,
                Status = bed.Status,
                Notes = bed.Notes
            };
        }
    }
}

public class CreateBedEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/beds", async (CreateBedRequest request, ISender sender, IValidator<CreateBedRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new CreateBed.Command
            {
                WardId = request.WardId,
                BedNumber = request.BedNumber,
                Status = request.Status,
                Notes = request.Notes
            };

            var result = await sender.Send(command);

            return Results.Created($"/api/beds/{result.Id}", result);
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Beds")
        .WithName("CreateBed")
        .WithDescription("Creates a new bed")
        .Produces<BedResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}