using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Wards;
using WardOps.API.Database;

namespace WardOps.API.Features.Wards;

public static class GetWard
{
    public class Query : IRequest<WardResponse>
    {
        public Guid Id { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Query, WardResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<WardResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var ward = await _dbContext.Wards
                .Include(w => w.Department)
                .Include(w => w.WardType)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            
            if (ward == null)
            {
                throw new KeyNotFoundException("Ward not found.");
            }

            return new WardResponse
            {
                Id = ward.Id,
                DepartmentId = ward.DepartmentId,
                DepartmentName = ward.Department.Name,
                WardTypeId = ward.WardTypeId,
                WardTypeName = ward.WardType.Name,
                WardNumber = ward.WardNumber,
                GenderPolicy = ward.GenderPolicy,
                MaxCapacity = ward.MaxCapacity,
                Notes = ward.Notes
            };
        }
    }
}

public class GetWardEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/wards/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var query = new GetWard.Query { Id = id };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Wards")
        .WithName("GetWard")
        .WithDescription("Get details of a specific ward by ID")
        .Produces<WardResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
