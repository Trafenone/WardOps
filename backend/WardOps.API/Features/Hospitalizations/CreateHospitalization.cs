using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Hospitalizations;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Hospitalizations;

public static class CreateHospitalization
{
    public class Command : IRequest<HospitalizationResponse>
    {
        public Guid PatientId { get; set; }
        public Guid BedId { get; set; }
        public DateTime AdmissionDateTime { get; set; }
        public DateTime? PlannedDischargeDateTime { get; set; }
        public string? AdmissionReason { get; set; }
        public HospitalizationStatus Status { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, HospitalizationResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<HospitalizationResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            var patient = await _dbContext.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId, cancellationToken);
            if (patient == null)
            {
                throw new KeyNotFoundException("Patient not found.");
            }

            var bed = await _dbContext.Beds
                .Include(b => b.Ward)
                    .ThenInclude(w => w.Department)
                .FirstOrDefaultAsync(b => b.Id == request.BedId, cancellationToken);

            if (bed == null)
            {
                throw new KeyNotFoundException("Bed not found.");
            }

            if (bed.Status != BedStatus.Available)
            {
                throw new InvalidOperationException($"Bed is not available. Current status: {bed.Status}");
            }

            var hospitalization = new Hospitalization
            {
                Id = Guid.NewGuid(),
                PatientId = request.PatientId,
                BedId = request.BedId,
                AdmissionDateTime = request.AdmissionDateTime,
                PlannedDischargeDateTime = request.PlannedDischargeDateTime,
                AdmissionReason = request.AdmissionReason,
                Status = request.Status
            };

            bed.Status = BedStatus.Occupied;

            await _dbContext.Hospitalizations.AddAsync(hospitalization, cancellationToken);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new HospitalizationResponse
            {
                Id = hospitalization.Id,
                PatientId = hospitalization.PatientId,
                PatientFullName = $"{patient.FirstName} {patient.LastName}",
                BedId = hospitalization.BedId,
                BedNumber = bed.BedNumber,
                WardNumber = bed.Ward.WardNumber,
                DepartmentName = bed.Ward.Department.Name,
                AdmissionDateTime = hospitalization.AdmissionDateTime,
                PlannedDischargeDateTime = hospitalization.PlannedDischargeDateTime,
                ActualDischargeDateTime = hospitalization.ActualDischargeDateTime,
                AdmissionReason = hospitalization.AdmissionReason,
                DischargeReason = hospitalization.DischargeReason,
                Status = hospitalization.Status
            };
        }
    }
}

public class CreateHospitalizationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/hospitalizations", async ([FromBody] CreateHospitalizationRequest request, ISender sender, IValidator<CreateHospitalizationRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new CreateHospitalization.Command
            {
                PatientId = request.PatientId,
                BedId = request.BedId,
                AdmissionDateTime = request.AdmissionDateTime,
                PlannedDischargeDateTime = request.PlannedDischargeDateTime,
                AdmissionReason = request.AdmissionReason,
                Status = request.Status
            };

            var result = await sender.Send(command);

            return Results.Created($"/api/hospitalizations/{result.Id}", result);
        })
        .WithTags("Hospitalizations")
        .WithName("CreateHospitalization")
        .WithDescription("Create a new hospitalization")
        .Produces<HospitalizationResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}