using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WardOps.API.Contracts.Hospitalizations;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;
using WardOps.API.Services;

namespace WardOps.API.Features.Hospitalizations;

public static class DischargePatient
{
    public class Command : IRequest<HospitalizationResponse>
    {
        public Guid PatientId { get; set; }
        public string? DischargeReason { get; set; }
        public DateTime ActualDischargeDateTime { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, HospitalizationResponse>
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;

        public Handler(ApplicationDbContext dbContext, ICurrentUserService currentUserService)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;
        }

        public async Task<HospitalizationResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            var hospitalization = await _dbContext.Hospitalizations
                .Include(h => h.Patient)
                .Include(h => h.Bed)
                    .ThenInclude(b => b.Ward)
                        .ThenInclude(w => w.Department)
                .FirstOrDefaultAsync(h => h.PatientId == request.PatientId && h.Status == HospitalizationStatus.Active, cancellationToken);

            if (hospitalization == null)
            {
                throw new KeyNotFoundException("Hospitalization not found.");
            }

            hospitalization.Status = HospitalizationStatus.Discharged;
            hospitalization.ActualDischargeDateTime = request.ActualDischargeDateTime;
            hospitalization.DischargeReason = request.DischargeReason;

            hospitalization.Bed.Status = BedStatus.Cleaning;
            hospitalization.Patient.Status = PatientStatus.Discharged;

            _dbContext.Update(hospitalization);

            var userId = _currentUserService.GetCurrentUserId();
            var bedEventLog = new BedEventLog
            {
                BedId = hospitalization.Bed.Id,
                PatientId = hospitalization.PatientId,
                EventType = BedEventType.Freed,
                Timestamp = DateTime.UtcNow,
                UserId = userId,
                Notes = $"Patient {hospitalization.Patient?.FirstName} {hospitalization.Patient?.LastName} was discharged from bed {hospitalization.Bed.BedNumber}."
            };
            _dbContext.BedEventLogs.Add(bedEventLog);

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

public class DischargePatientEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/patients/{id}/hospitalization/discharge", async ([FromRoute] Guid id, [FromBody] DischargePatientRequest request, ISender sender, IValidator<DischargePatientRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new DischargePatient.Command
            {
                PatientId = id,
                DischargeReason = request.DischargeReason,
                ActualDischargeDateTime = request.ActualDischargeDateTime ?? DateTime.UtcNow
            };

            var result = await sender.Send(command);

            return Results.Ok(result);
        })
        .RequireAuthorization()
        .WithTags("Hospitalizations")
        .WithName("DischargePatient")
        .WithDescription("Discharge a patient from their current hospitalization")
        .Produces<HospitalizationResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}