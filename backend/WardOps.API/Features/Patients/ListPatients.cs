using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Patients;
using WardOps.API.Database;

namespace WardOps.API.Features.Patients;

public class ListPatients
{
    public class Query : IRequest<ListPatientsResponse>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, ListPatientsResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListPatientsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var patients = await _dbContext.Patients.ToListAsync(cancellationToken);

            return new ListPatientsResponse
            {
                Patients = patients.Select(p => new PatientResponse
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    DateOfBirth = p.DateOfBirth,
                    Gender = p.Gender,
                    PhoneNumber = p.PhoneNumber,
                    MedicalCardNumber = p.MedicalCardNumber,
                    AdmissionDiagnosis = p.AdmissionDiagnosis,
                    RequiresIsolation = p.RequiresIsolation,
                    Notes = p.Notes
                }).ToList()
            };
        }
    }
}

public class ListPatientsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/patients", async (IMediator mediator) =>
        {
            var query = new ListPatients.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .WithTags("Patients")
        .WithName("ListPatients")
        .WithDescription("Get list of patients")
        .Produces<ListPatientsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}