using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Database;

namespace WardOps.API.Features.Departments;

public static class DeleteDepartment
{
    public class Command : IRequest<Unit>
    {
        public Guid Id { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, Unit>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
        {
            var department = await _dbContext.Departments.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (department == null)
            {
                throw new KeyNotFoundException("Department not found.");
            }

            _dbContext.Departments.Remove(department);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}

public class DeleteDepartmentEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("api/departments/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var command = new DeleteDepartment.Command { Id = id };

            await mediator.Send(command);

            return Results.NoContent();
        })
        .WithTags("Departments")
        .WithName("DeleteDepartment")
        .WithDescription("Delete an existing department")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
