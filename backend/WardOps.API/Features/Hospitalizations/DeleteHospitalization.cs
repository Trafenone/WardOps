using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Database;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Hospitalizations;

public static class DeleteHospitalization
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
            var hospitalization = await _dbContext.Hospitalizations
                .Include(h => h.Bed)
                .FirstOrDefaultAsync(h => h.Id == request.Id, cancellationToken);

            if (hospitalization == null)
            {
                throw new KeyNotFoundException("Hospitalization not found.");
            }

            if (hospitalization.Status == HospitalizationStatus.Active)
            {
                hospitalization.Bed.Status = BedStatus.Available;
            }

            _dbContext.Hospitalizations.Remove(hospitalization);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}

public class DeleteHospitalizationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("api/hospitalizations/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var command = new DeleteHospitalization.Command { Id = id };

            await mediator.Send(command);

            return Results.NoContent();
        })
        .WithTags("Hospitalizations")
        .WithName("DeleteHospitalization")
        .WithDescription("Delete a hospitalization")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}