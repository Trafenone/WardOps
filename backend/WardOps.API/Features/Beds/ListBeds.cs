using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Beds;
using WardOps.API.Database;

namespace WardOps.API.Features.Beds;

public class ListBeds
{
    public class Query : IRequest<ListBedsResponse>
    {
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
            var beds = await _dbContext.Beds
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

public class ListBedsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/beds", async (IMediator mediator) =>
        {
            var query = new ListBeds.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Beds")
        .WithName("ListBeds")
        .WithDescription("Get list of all beds")
        .Produces<ListBedsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}