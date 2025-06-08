using Carter;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Patients;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Patients;

public static class CreatePatient
{
    public class Command : IRequest<PatientResponse>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string? PhoneNumber { get; set; }
        public string? MedicalCardNumber { get; set; }
        public string? AdmissionDiagnosis { get; set; }
        public bool RequiresIsolation { get; set; }
        public string? Notes { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, PatientResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<PatientResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            if (!string.IsNullOrWhiteSpace(request.MedicalCardNumber) &&
                await _dbContext.Patients.AnyAsync(p => p.MedicalCardNumber == request.MedicalCardNumber, cancellationToken))
            {
                throw new InvalidOperationException("A patient with the same medical card number already exists.");
            }

            var patient = new Patient
            {
                Id = Guid.NewGuid(),
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
                PhoneNumber = request.PhoneNumber,
                MedicalCardNumber = request.MedicalCardNumber,
                AdmissionDiagnosis = request.AdmissionDiagnosis,
                RequiresIsolation = request.RequiresIsolation,
                Notes = request.Notes
            };

            _dbContext.Add(patient);
            await _dbContext.SaveChangesAsync(cancellationToken);

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

public class CreatePatientEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/patients", async (CreatePatientRequest request, ISender sender, IValidator<CreatePatientRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new CreatePatient.Command
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
                PhoneNumber = request.PhoneNumber,
                MedicalCardNumber = request.MedicalCardNumber,
                AdmissionDiagnosis = request.AdmissionDiagnosis,
                RequiresIsolation = request.RequiresIsolation,
                Notes = request.Notes
            };

            var result = await sender.Send(command);

            return Results.Created($"/api/patients/{result.Id}", result);
        })
        .RequireAuthorization()
        .WithTags("Patients")
        .WithName("CreatePatient")
        .WithDescription("Creates a new patient")
        .Produces<PatientResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}