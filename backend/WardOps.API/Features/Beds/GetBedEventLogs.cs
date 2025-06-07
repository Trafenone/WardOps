using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Beds;
using WardOps.API.Database;
using WardOps.API.Entities;

namespace WardOps.API.Features.Beds;

public class GetBedEventLogs
{
    public class Query : IRequest<ListBedEventLogsResponse>
    {
        public Guid BedId { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Query, ListBedEventLogsResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListBedEventLogsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var bed = await _dbContext.Beds.FirstOrDefaultAsync(b => b.Id == request.BedId, cancellationToken);
            if (bed == null)
            {
                throw new KeyNotFoundException("Bed not found.");
            }

            var eventLogs = await _dbContext.BedEventLogs
                .Include(bel => bel.Bed)
                .Include(bel => bel.User)
                .Include(bel => bel.Patient)
                .Where(bel => bel.BedId == request.BedId)
                .OrderByDescending(bel => bel.Timestamp)
                .ToListAsync(cancellationToken);

            return new ListBedEventLogsResponse
            {
                EventLogs = eventLogs.Select(bel => new BedEventLogResponse
                {
                    Id = bel.Id,
                    BedId = bel.BedId,
                    BedNumber = bel.Bed.BedNumber,
                    EventType = bel.EventType,
                    Timestamp = bel.Timestamp,
                    UserId = bel.UserId,
                    UserName = bel.User != null ? $"{bel.User.FirstName} {bel.User.LastName}" : null,
                    PatientId = bel.PatientId != Guid.Empty ? bel.PatientId : null,
                    PatientFullName = bel.Patient != null ? $"{bel.Patient.FirstName} {bel.Patient.LastName}" : null,
                    Notes = bel.Notes
                }).ToList()
            };
        }
    }
}

public class GetBedEventLogsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/beds/{bedId}/events", async ([FromRoute] Guid bedId, IMediator mediator) =>
        {
            var query = new GetBedEventLogs.Query { BedId = bedId };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .WithTags("Beds")
        .WithName("GetBedEventLogs")
        .WithDescription("Get event logs for a specific bed")
        .Produces<ListBedEventLogsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}