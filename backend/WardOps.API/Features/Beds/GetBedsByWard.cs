using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Beds;
using WardOps.API.Database;

namespace WardOps.API.Features.Beds;

public class GetBedsByWard
{
    public class Query : IRequest<ListBedsResponse>
    {
        public Guid WardId { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Query, ListBedsResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListBedsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var ward = await _dbContext.Wards.FirstOrDefaultAsync(w => w.Id == request.WardId, cancellationToken);
            if (ward == null)
            {
                throw new KeyNotFoundException("Ward not found.");
            }

            var beds = await _dbContext.Beds
                .Where(b => b.WardId == request.WardId)
                .Include(b => b.Ward)
                .ToListAsync(cancellationToken);

            return new ListBedsResponse
            {
                Beds = beds.Select(b => new BedResponse
                {
                    Id = b.Id,
                    WardId = b.WardId,
                    WardNumber = b.Ward.WardNumber,
                    BedNumber = b.BedNumber,
                    Status = b.Status,
                    Notes = b.Notes
                }).ToList()
            };
        }
    }
}

public class GetBedsByWardEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/wards/{wardId}/beds", async ([FromRoute] Guid wardId, IMediator mediator) =>
        {
            var query = new GetBedsByWard.Query { WardId = wardId };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .WithTags("Beds")
        .WithName("GetBedsByWard")
        .WithDescription("Get list of beds for a specific ward")
        .Produces<ListBedsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}