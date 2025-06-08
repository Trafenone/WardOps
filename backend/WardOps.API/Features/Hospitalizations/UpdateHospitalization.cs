using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Hospitalizations;
using WardOps.API.Database;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Hospitalizations;

public static class UpdateHospitalization
{
    public class Command : IRequest<HospitalizationResponse>
    {
        public Guid Id { get; set; }
        public Guid BedId { get; set; }
        public DateTime AdmissionDateTime { get; set; }
        public DateTime? PlannedDischargeDateTime { get; set; }
        public DateTime? ActualDischargeDateTime { get; set; }
        public string? AdmissionReason { get; set; }
        public string? DischargeReason { get; set; }
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
            var hospitalization = await _dbContext.Hospitalizations
                .Include(h => h.Patient)
                .Include(h => h.Bed)
                    .ThenInclude(b => b.Ward)
                        .ThenInclude(w => w.Department)
                .FirstOrDefaultAsync(h => h.Id == request.Id, cancellationToken);

            if (hospitalization == null)
            {
                throw new KeyNotFoundException("Hospitalization not found.");
            }

            if (hospitalization.BedId != request.BedId)
            {
                var newBed = await _dbContext.Beds
                    .Include(b => b.Ward)
                        .ThenInclude(w => w.Department)
                    .FirstOrDefaultAsync(b => b.Id == request.BedId, cancellationToken);

                if (newBed == null)
                {
                    throw new KeyNotFoundException("New bed not found.");
                }

                if (newBed.Status != BedStatus.Available)
                {
                    throw new InvalidOperationException($"New bed is not available. Current status: {newBed.Status}");
                }

                var oldBed = hospitalization.Bed;
                oldBed.Status = BedStatus.Available;

                newBed.Status = BedStatus.Occupied;

                hospitalization.Bed = newBed;
                hospitalization.BedId = request.BedId;
            }

            bool becomingDischarged = hospitalization.Status == HospitalizationStatus.Active &&
                                      request.Status == HospitalizationStatus.Discharged;

            if (becomingDischarged)
            {
                hospitalization.Bed.Status = BedStatus.Cleaning;

                if (!request.ActualDischargeDateTime.HasValue)
                {
                    hospitalization.ActualDischargeDateTime = DateTime.UtcNow;
                }
            }

            hospitalization.AdmissionDateTime = request.AdmissionDateTime;
            hospitalization.PlannedDischargeDateTime = request.PlannedDischargeDateTime;
            hospitalization.ActualDischargeDateTime = request.ActualDischargeDateTime;
            hospitalization.AdmissionReason = request.AdmissionReason;
            hospitalization.DischargeReason = request.DischargeReason;
            hospitalization.Status = request.Status;

            _dbContext.Update(hospitalization);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new HospitalizationResponse
            {
                Id = hospitalization.Id,
                PatientId = hospitalization.PatientId,
                PatientFullName = $"{hospitalization.Patient.FirstName} {hospitalization.Patient.LastName}",
                BedId = hospitalization.BedId,
                BedNumber = hospitalization.Bed.BedNumber,
                WardNumber = hospitalization.Bed.Ward.WardNumber,
                DepartmentName = hospitalization.Bed.Ward.Department.Name,
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

public class UpdateHospitalizationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("api/hospitalizations/{id}", async ([FromRoute] Guid id, [FromBody] UpdateHospitalizationRequest request, ISender sender, IValidator<UpdateHospitalizationRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new UpdateHospitalization.Command
            {
                Id = id,
                BedId = request.BedId,
                AdmissionDateTime = request.AdmissionDateTime,
                PlannedDischargeDateTime = request.PlannedDischargeDateTime,
                ActualDischargeDateTime = request.ActualDischargeDateTime,
                AdmissionReason = request.AdmissionReason,
                DischargeReason = request.DischargeReason,
                Status = request.Status
            };

            var result = await sender.Send(command);

            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithTags("Hospitalizations")
        .WithName("UpdateHospitalization")
        .WithDescription("Update an existing hospitalization")
        .Produces<HospitalizationResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}