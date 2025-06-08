using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Database;

namespace WardOps.API.Features.Patients;

public static class DeletePatient
{
    public class Command : IRequest<bool>
    {
        public Guid Id { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, bool>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            var patient = await _dbContext.Patients
                .Include(p => p.Hospitalizations)
                .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

            if (patient == null)
            {
                throw new KeyNotFoundException("Patient not found.");
            }

            if (patient.Hospitalizations.Any())
            {
                throw new InvalidOperationException("Cannot delete patient with active or past hospitalizations.");
            }

            _dbContext.Remove(patient);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}

public class DeletePatientEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapDelete("api/patients/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var command = new DeletePatient.Command { Id = id };

            await mediator.Send(command);

            return Results.NoContent();
        })
        .WithTags("Patients")
        .WithName("DeletePatient")
        .WithDescription("Deletes a specific patient")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}