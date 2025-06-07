using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Departments;
using WardOps.API.Database;

namespace WardOps.API.Features.Departments;

public class ListDepartments
{
    public class Query : IRequest<ListDepartmentsResponse>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, ListDepartmentsResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListDepartmentsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var departments = await _dbContext.Departments.ToListAsync(cancellationToken);

            return new ListDepartmentsResponse
            {
                Departments = departments.Select(d => new DepartmentResponse
                {
                    Id = d.Id,
                    Name = d.Name,
                    Building = d.Building,
                    FloorNumber = d.FloorNumber,
                    Description = d.Description
                }).ToList()
            };
        }
    }
}

public class ListDepartmentsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/departments", async (IMediator mediator) =>
        {
            var query = new ListDepartments.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .WithTags("Departments")
        .WithName("ListDepartments")
        .WithDescription("Get list of departments")
        .Produces<ListDepartmentsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
