using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Patients;
using WardOps.API.Database;

namespace WardOps.API.Features.Patients;

public class GetPatient
{
    public class Query : IRequest<PatientResponse>
    {
        public Guid Id { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Query, PatientResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PatientResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var patient = await _dbContext.Patients.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
            if (patient == null)
            {
                throw new KeyNotFoundException("Patient not found.");
            }

            return new PatientResponse
            {
                Id = patient.Id,
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                PhoneNumber = patient.PhoneNumber,
                MedicalCardNumber = patient.MedicalCardNumber,
                AdmissionDiagnosis = patient.AdmissionDiagnosis,
                RequiresIsolation = patient.RequiresIsolation,
                Notes = patient.Notes
            };
        }
    }
}

public class GetPatientEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/patients/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var query = new GetPatient.Query { Id = id };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Patients")
        .WithName("GetPatient")
        .WithDescription("Get a specific patient by ID")
        .Produces<PatientResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}