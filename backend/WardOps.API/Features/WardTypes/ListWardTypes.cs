using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.WardTypes;
using WardOps.API.Database;

namespace WardOps.API.Features.WardTypes;

public class ListWardTypes
{
    public class Query : IRequest<ListWardTypesResponse>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, ListWardTypesResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListWardTypesResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var wardTypes = await _dbContext.WardTypes.ToListAsync(cancellationToken);

            return new ListWardTypesResponse
            {
                WardTypes = wardTypes.Select(wt => new WardTypeResponse
                {
                    Id = wt.Id,
                    Name = wt.Name,
                    Description = wt.Description
                }).ToList()
            };
        }
    }
}

public class ListWardTypesEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/wardtypes", async (IMediator mediator) =>
        {
            var query = new ListWardTypes.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("WardTypes")
        .WithName("ListWardTypes")
        .WithDescription("Get list of ward types")
        .Produces<ListWardTypesResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}