using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Departments;
using WardOps.API.Database;

namespace WardOps.API.Features.Departments;

public static class GetDepartment
{
    public class Query : IRequest<DepartmentResponse>
    {
        public Guid Id { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Query, DepartmentResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DepartmentResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (department == null)
            {
                throw new KeyNotFoundException("Department not found.");
            }

            return new DepartmentResponse
            {
                Id = department.Id,
                Name = department.Name,
                Building = department.Building,
                FloorNumber = department.FloorNumber,
                Description = department.Description
            };
        }
    }
}

public class GetDepartmentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/departments/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var query = new GetDepartment.Query { Id = id };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Departments")
        .WithName("GetDepartment")
        .WithDescription("Get details of a specific department by ID")
        .Produces<DepartmentResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
