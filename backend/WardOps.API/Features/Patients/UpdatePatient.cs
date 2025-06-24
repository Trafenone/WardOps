using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Patients;
using WardOps.API.Database;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Patients;

public static class UpdatePatient
{
    public class Command : IRequest<PatientResponse>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public Gender Gender { get; set; }
        public string? PhoneNumber { get; set; }
        public string? MedicalCardNumber { get; set; }
        public string? AdmissionDiagnosis { get; set; }
        public bool RequiresIsolation { get; set; }
        public PatientStatus Status { get; set; }
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
            var patient = await _dbContext.Patients.FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);
            if (patient == null)
            {
                throw new KeyNotFoundException("Patient not found.");
            }

            if (!string.IsNullOrWhiteSpace(request.MedicalCardNumber) &&
                await _dbContext.Patients.AnyAsync(p =>
                    p.MedicalCardNumber == request.MedicalCardNumber &&
                    p.Id != request.Id, cancellationToken))
            {
                throw new InvalidOperationException("A patient with the same medical card number already exists.");
            }

            patient.FirstName = request.FirstName;
            patient.LastName = request.LastName;
            patient.DateOfBirth = request.DateOfBirth;
            patient.Gender = request.Gender;
            patient.PhoneNumber = request.PhoneNumber;
            patient.MedicalCardNumber = request.MedicalCardNumber;
            patient.AdmissionDiagnosis = request.AdmissionDiagnosis;
            patient.RequiresIsolation = request.RequiresIsolation;
            patient.Status = request.Status;
            patient.Notes = request.Notes;

            _dbContext.Update(patient);
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
                Status = request.Status,
                Notes = patient.Notes
            };
        }
    }
}

public class UpdatePatientEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("api/patients/{id}", async ([FromRoute] Guid id, [FromBody] UpdatePatientRequest request, ISender sender, IValidator<UpdatePatientRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new UpdatePatient.Command
            {
                Id = id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
                PhoneNumber = request.PhoneNumber,
                MedicalCardNumber = request.MedicalCardNumber,
                AdmissionDiagnosis = request.AdmissionDiagnosis,
                RequiresIsolation = request.RequiresIsolation,
                Status = request.Status,
                Notes = request.Notes
            };

            var result = await sender.Send(command);

            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithTags("Patients")
        .WithName("UpdatePatient")
        .WithDescription("Updates an existing patient")
        .Produces<PatientResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}