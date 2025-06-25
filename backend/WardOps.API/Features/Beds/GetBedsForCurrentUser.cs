using Carter;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Beds;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;
using WardOps.API.Services;

namespace WardOps.API.Features.Beds;

public class GetBedsForCurrentUser
{
    public class Query : IRequest<ListBedsResponse>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, ListBedsResponse>
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<ApplicationUser> _userManager;

        public Handler(ApplicationDbContext dbContext, ICurrentUserService currentUserService, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;
            _userManager = userManager;
        }

        public async Task<ListBedsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _currentUserService.GetCurrentUserAsync();
            if (user == null)
            {
                throw new InvalidOperationException("Cannot find the current user");
            }

            var query = _dbContext.Beds.Include(b => b.Ward).ThenInclude(b => b.Department).AsQueryable();

            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles.Contains(Roles.Staff))
            {
                query = query.Where(b => b.Ward.DepartmentId == user.DepartmentId);
            }

            var beds = await query
                .Include(x => x.Hospitalizations)
                .ThenInclude(h => h.Patient)
                .ToListAsync(cancellationToken);

            return new ListBedsResponse
            {
                Beds = beds.Select(b =>
                {
                    var activeHospitalization =
                        b.Hospitalizations.FirstOrDefault(x =>
                            x.Status == HospitalizationStatus.Active);
                    return new BedResponse
                    {
                        Id = b.Id,
                        WardId = b.WardId,
                        WardNumber = b.Ward.WardNumber,
                        DepartmentId = b.Ward.DepartmentId,
                        DepartmentName = b.Ward.Department.Name,
                        BedNumber = b.BedNumber,
                        PatientId = activeHospitalization?.PatientId,
                        PatientName = activeHospitalization?.Patient?.GetFullName,
                        Status = b.Status,
                        Notes = b.Notes
                    };
                }).ToList()
            };
        }
    }
}

public class GetBedsForCurrentUserEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/beds/my", async (IMediator mediator) =>
        {
            var query = new GetBedsForCurrentUser.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Beds")
        .WithName("GetBedsForCurrentUser")
        .WithDescription("Retrieves beds for the current user based on their role and department.")
        .Produces<ListBedsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
