using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Wards;
using WardOps.API.Database;

namespace WardOps.API.Features.Wards;

public static class GetWardsByWardType
{
    public class Query : IRequest<ListWardsResponse>
    {
        public Guid WardTypeId { get; set; }
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
            var wardType = await _dbContext.WardTypes.FirstOrDefaultAsync(wt => wt.Id == request.WardTypeId, cancellationToken);
            if (wardType == null)
            {
                throw new KeyNotFoundException("Ward Type not found.");
            }

            var wards = await _dbContext.Wards
                .Where(w => w.WardTypeId == request.WardTypeId)
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

public class GetWardsByWardTypeEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/wardtypes/{wardTypeId}/wards", async ([FromRoute] Guid wardTypeId, IMediator mediator) =>
        {
            var query = new GetWardsByWardType.Query { WardTypeId = wardTypeId };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .WithTags("Wards")
        .WithName("GetWardsByWardType")
        .WithDescription("Get list of wards for a specific ward type")
        .Produces<ListWardsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}