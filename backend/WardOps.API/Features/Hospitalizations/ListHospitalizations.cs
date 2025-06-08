using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Hospitalizations;
using WardOps.API.Database;

namespace WardOps.API.Features.Hospitalizations;

public class ListHospitalizations
{
    public class Query : IRequest<ListHospitalizationsResponse>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, ListHospitalizationsResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListHospitalizationsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var hospitalizations = await _dbContext.Hospitalizations
                .Include(h => h.Patient)
                .Include(h => h.Bed)
                    .ThenInclude(b => b.Ward)
                        .ThenInclude(w => w.Department)
                .OrderByDescending(h => h.AdmissionDateTime)
                .ToListAsync(cancellationToken);

            return new ListHospitalizationsResponse
            {
                Hospitalizations = hospitalizations.Select(h => new HospitalizationResponse
                {
                    Id = h.Id,
                    PatientId = h.PatientId,
                    PatientFullName = $"{h.Patient.FirstName} {h.Patient.LastName}",
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

public class ListHospitalizationsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/hospitalizations", async (IMediator mediator) =>
        {
            var query = new ListHospitalizations.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .WithTags("Hospitalizations")
        .WithName("GetHospitalizations")
        .WithDescription("Get list of hospitalizations")
        .Produces<ListHospitalizationsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}