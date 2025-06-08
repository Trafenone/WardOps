using Carter;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Patients;
using WardOps.API.Database;

namespace WardOps.API.Features.Patients;

public class SearchPatients
{
    public class Query : IRequest<ListPatientsResponse>
    {
        public string? SearchTerm { get; set; }
        public bool? RequiresIsolation { get; set; }
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
            var query = _dbContext.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(request.SearchTerm))
            {
                var searchTerm = request.SearchTerm.ToLower();
                query = query.Where(p =>
                    p.FirstName.ToLower().Contains(searchTerm) ||
                    p.LastName.ToLower().Contains(searchTerm) ||
                    (p.MedicalCardNumber != null && p.MedicalCardNumber.ToLower().Contains(searchTerm))
                );
            }

            if (request.RequiresIsolation.HasValue)
            {
                query = query.Where(p => p.RequiresIsolation == request.RequiresIsolation.Value);
            }

            var patients = await query.ToListAsync(cancellationToken);

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

public class SearchPatientsEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/patients/search", async ([FromQuery] string? searchTerm, [FromQuery] bool? requiresIsolation, IMediator mediator) =>
        {
            var query = new SearchPatients.Query
            {
                SearchTerm = searchTerm,
                RequiresIsolation = requiresIsolation
            };

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Patients")
        .WithName("SearchPatients")
        .WithDescription("Search for patients by name, medical card number, or isolation status")
        .Produces<ListPatientsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}