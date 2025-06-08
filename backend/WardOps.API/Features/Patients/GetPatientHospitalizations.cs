using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Patients;
using WardOps.API.Database;

namespace WardOps.API.Features.Patients;

public class GetPatientHospitalizations
{
    public class Query : IRequest<ListPatientHospitalizationsResponse>
    {
        public Guid PatientId { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Query, ListPatientHospitalizationsResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListPatientHospitalizationsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var patient = await _dbContext.Patients.FirstOrDefaultAsync(p => p.Id == request.PatientId, cancellationToken);
            if (patient == null)
            {
                throw new KeyNotFoundException("Patient not found.");
            }

            var hospitalizations = await _dbContext.Hospitalizations
                .Where(h => h.PatientId == request.PatientId)
                .Include(h => h.Bed)
                    .ThenInclude(b => b.Ward)
                        .ThenInclude(w => w.Department)
                .OrderByDescending(h => h.AdmissionDateTime)
                .ToListAsync(cancellationToken);

            return new ListPatientHospitalizationsResponse
            {
                PatientId = patient.Id,
                PatientFullName = $"{patient.FirstName} {patient.LastName}",
                Hospitalizations = hospitalizations.Select(h => new PatientHospitalizationResponse
                {
                    Id = h.Id,
                    PatientId = h.PatientId,
                    BedId = h.BedId,
                    BedNumber = h.Bed.BedNumber,
                    WardNumber = h.Bed.Ward.WardNumber,
                    DepartmentName = h.Bed.Ward.Department.Name,
                    AdmissionDateTime = h.AdmissionDateTime,
                    PlannedDischargeDateTime = h.PlannedDischargeDateTime,
                    ActualDischargeDateTime = h.ActualDischargeDateTime,
                    AdmissionReason = h.AdmissionReason,
                    DischargeReason = h.DischargeReason,
                    Status = h.Status
                }).ToList()
            };
        }
    }
}

public class GetPatientHospitalizationsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/patients/{patientId}/hospitalizations", async ([FromRoute] Guid patientId, IMediator mediator) =>
        {
            var query = new GetPatientHospitalizations.Query { PatientId = patientId };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Patients")
        .WithName("GetPatientHospitalizations")
        .WithDescription("Get hospitalization history for a specific patient")
        .Produces<ListPatientHospitalizationsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}