using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Beds;
using WardOps.API.Contracts.HospitalStructures;
using WardOps.API.Contracts.WardTypes;
using WardOps.API.Database;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.HospitalStructures;

public static class GetHospitalStructure
{
    public class Query : IRequest<GetHospitalStructureResponse>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, GetHospitalStructureResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<GetHospitalStructureResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var departments = await _dbContext.Departments
                .Include(d => d.Wards)
                    .ThenInclude(w => w.WardType)
                .Include(d => d.Wards)
                    .ThenInclude(w => w.Beds)
                .ToListAsync(cancellationToken);

            var activeHospitalizations = await _dbContext.Hospitalizations
                .Where(h => h.Status == HospitalizationStatus.Active)
                .Include(h => h.Patient)
                .ToDictionaryAsync(h => h.BedId, h => new { h.PatientId, PatientName = $"{h.Patient.FirstName} {h.Patient.LastName}" },
                    cancellationToken);

            var departmentsWithWards = departments.Select(d =>
                new DepartmentWithWardsResponse
                {
                    Id = d.Id,
                    Name = d.Name,
                    Building = d.Building,
                    FloorNumber = d.FloorNumber,
                    Description = d.Description,
                    Wards = d.Wards.Select(w => new WardWithBedsResponse
                    {
                        Id = w.Id,
                        DepartmentId = w.DepartmentId,
                        DepartmentName = w.Department.Name,
                        WardTypeId = w.WardTypeId,
                        WardTypeName = w.WardType.Name,
                        WardNumber = w.WardNumber,
                        GenderPolicy = w.GenderPolicy,
                        MaxCapacity = w.MaxCapacity,
                        Notes = w.Notes,
                        Beds = w.Beds.Select(b =>
                        {
                            activeHospitalizations.TryGetValue(b.Id, out var hospitalization);

                            return new BedResponse
                            {
                                Id = b.Id,
                                WardId = b.WardId,
                                WardNumber = b.Ward.WardNumber,
                                BedNumber = b.BedNumber,
                                DepartmentId = w.DepartmentId,
                                DepartmentName = w.Department.Name,
                                Status = b.Status,
                                PatientId = hospitalization?.PatientId,
                                PatientName = hospitalization?.PatientName,
                                Notes = b.Notes
                            };
                        }).ToList()
                    }).ToList()
                }).ToList();

            return new GetHospitalStructureResponse
            {
                Departments = departmentsWithWards
            };
        }
    }
}

public class GetHospitalStructureEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/departmentstructure", async (IMediator mediator) =>
        {
            var query = new GetHospitalStructure.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("HospitalStructure")
        .WithName("GetHospitalStructure")
        .WithDescription("Get departments with their wards and ward types for structure visualization")
        .Produces<GetHospitalStructureResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}