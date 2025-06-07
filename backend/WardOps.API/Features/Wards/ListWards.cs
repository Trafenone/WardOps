using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Wards;
using WardOps.API.Database;

namespace WardOps.API.Features.Wards;

public class ListWards
{
    public class Query : IRequest<ListWardsResponse>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, ListWardsResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListWardsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var wards = await _dbContext.Wards
                .Include(w => w.Department)
                .Include(w => w.WardType)
                .ToListAsync(cancellationToken);

            return new ListWardsResponse
            {
                Wards = wards.Select(w => new WardResponse
                {
                    Id = w.Id,
                    DepartmentId = w.DepartmentId,
                    DepartmentName = w.Department.Name,
                    WardTypeId = w.WardTypeId,
                    WardTypeName = w.WardType.Name,
                    WardNumber = w.WardNumber,
                    GenderPolicy = w.GenderPolicy,
                    MaxCapacity = w.MaxCapacity,
                    Notes = w.Notes
                }).ToList()
            };
        }
    }
}

public class ListWardsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/wards", async (IMediator mediator) =>
        {
            var query = new ListWards.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .WithTags("Wards")
        .WithName("ListWards")
        .WithDescription("Get list of wards")
        .Produces<ListWardsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
