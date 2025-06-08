using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Database;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Beds;

public static class DeleteBed
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
            var bed = await _dbContext.Beds
                .Include(b => b.Hospitalizations)
                .FirstOrDefaultAsync(b => b.Id == request.Id, cancellationToken);

            if (bed == null)
            {
                throw new KeyNotFoundException("Bed not found.");
            }

            if (bed.Hospitalizations.Any(h => h.Status == HospitalizationStatus.Active))
            {
                throw new InvalidOperationException("Cannot delete bed with active hospitalizations.");
            }

            _dbContext.Beds.Remove(bed);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}

public class DeleteBedEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("api/beds/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var command = new DeleteBed.Command { Id = id };

            await mediator.Send(command);

            return Results.NoContent();
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Beds")
        .WithName("DeleteBed")
        .WithDescription("Deletes a bed")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}