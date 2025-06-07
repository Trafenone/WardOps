using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Wards;
using WardOps.API.Database;

namespace WardOps.API.Features.Wards;

public static class GetWardsByDepartment
{
    public class Query : IRequest<ListWardsResponse>
    {
        public Guid DepartmentId { get; set; }
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
            var department = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Id == request.DepartmentId, cancellationToken);
            if (department == null)
            {
                throw new KeyNotFoundException("Department not found.");
            }

            var wards = await _dbContext.Wards
                .Where(w => w.DepartmentId == request.DepartmentId)
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

public class GetWardsByDepartmentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/departments/{departmentId}/wards", async ([FromRoute] Guid departmentId, IMediator mediator) =>
        {
            var query = new GetWardsByDepartment.Query { DepartmentId = departmentId };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .WithTags("Wards")
        .WithName("GetWardsByDepartment")
        .WithDescription("Get list of wards for a specific department")
        .Produces<ListWardsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}