using Carter;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Departments;
using WardOps.API.Database;
using WardOps.API.Entities;

namespace WardOps.API.Features.Departments;

public static class CreateDepartment
{
    public class Command : IRequest<DepartmentResponse>
    {
        public string Name { get; set; } = string.Empty;
        public string? Building { get; set; }
        public int? FloorNumber { get; set; }
        public string? Description { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, DepartmentResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<DepartmentResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            if (await _dbContext.Departments.AnyAsync(d => d.Name == request.Name, cancellationToken))
            {
                throw new InvalidOperationException("Department with the same name already exists.");
            }

            var department = new Department
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Building = request.Building,
                FloorNumber = request.FloorNumber,
                Description = request.Description
            };

            _dbContext.Add(department);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new DepartmentResponse()
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

public class CreateDepartmentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/departments", async (CreateDepartmentRequest request, ISender sender, IValidator<CreateDepartmentRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new CreateDepartment.Command
            {
                Name = request.Name,
                Building = request.Building,
                FloorNumber = request.FloorNumber,
                Description = request.Description
            };

            var result = await sender.Send(command);

            return Results.Created($"/api/departments/{result.Id}", result);
        })
        .WithTags("Departments")
        .WithName("CreateDepartment")
        .WithDescription("Creates a new department")
        .Produces<Guid>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}