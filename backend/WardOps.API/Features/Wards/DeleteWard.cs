using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Database;

namespace WardOps.API.Features.Wards;

public static class DeleteWard
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
            var ward = await _dbContext.Wards
                .Include(w => w.Beds)
                .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);

            if (ward == null)
            {
                throw new KeyNotFoundException("Ward not found.");
            }

            if (ward.Beds.Any())
            {
                throw new InvalidOperationException("Cannot delete ward because it has associated beds. Remove all beds first.");
            }

            _dbContext.Wards.Remove(ward);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}

public class DeleteWardEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("api/wards/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var command = new DeleteWard.Command { Id = id };

            await mediator.Send(command);

            return Results.NoContent();
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Wards")
        .WithName("DeleteWard")
        .WithDescription("Delete an existing ward")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
