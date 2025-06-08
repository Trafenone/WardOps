using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Hospitalizations;
using WardOps.API.Database;

namespace WardOps.API.Features.Hospitalizations;

public class GetHospitalization
{
    public class Query : IRequest<HospitalizationResponse>
    {
        public Guid Id { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Query, HospitalizationResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<HospitalizationResponse> Handle(Query request, CancellationToken cancellationToken)
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

public class GetHospitalizationEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/hospitalizations/{id}", async ([FromRoute] Guid id, IMediator mediator) =>
        {
            var query = new GetHospitalization.Query { Id = id };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Hospitalizations")
        .WithName("GetHospitalization")
        .WithDescription("Get a specific hospitalization by ID")
        .Produces<HospitalizationResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}