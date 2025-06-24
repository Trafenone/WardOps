using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Departments;
using WardOps.API.Database;

namespace WardOps.API.Features.Departments;

public static class UpdateDepartment
{
    public class Command : IRequest<DepartmentResponse>
    {
        public Guid Id { get; set; }
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
            var department = await _dbContext.Departments.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (department == null)
            {
                throw new KeyNotFoundException("Department not found.");
            }

            if (await _dbContext.Departments.AnyAsync(d => d.Name == request.Name && d.Id != request.Id, cancellationToken))
            {
                throw new InvalidOperationException("Department with the same name already exists.");
            }

            department.Name = request.Name;
            department.Building = request.Building;
            department.FloorNumber = request.FloorNumber;
            department.Description = request.Description;

            _dbContext.Update(department);
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

public class UpdateDepartmentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("api/departments/{id}", async ([FromRoute] Guid id, [FromBody] UpdateDepartmentRequest request, ISender sender, IValidator<CreateDepartmentRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new UpdateDepartment.Command
            {
                Id = id,
                Name = request.Name,
                Building = request.Building,
                FloorNumber = request.FloorNumber,
                Description = request.Description
            };

            var result = await sender.Send(command);

            return Results.Ok(result);
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Departments")
        .WithName("UpdateDepartment")
        .WithDescription("Updates an existing department")
        .Produces<DepartmentResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
