using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Departments;
using WardOps.API.Contracts.Staff;
using WardOps.API.Database;
using WardOps.API.Entities;

namespace WardOps.API.Features.Staff;

public class ListStaff
{
    public class Query : IRequest<ListStaffResponse>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, ListStaffResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListStaffResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            IQueryable<ApplicationUser> staffQuery = _dbContext.Users
                .Include(u => u.Department);

            var role = await _dbContext.Roles.FirstOrDefaultAsync(r => r.Name == Roles.Staff, cancellationToken);
            if (role == null)
            {
                throw new InvalidOperationException("Staff role not found in the database.");
            }

            var userIds = await _dbContext.UserRoles
                .Where(ur => ur.RoleId == role.Id)
                .Select(ur => ur.UserId)
                .ToListAsync(cancellationToken);

            staffQuery = staffQuery.Where(u => userIds.Contains(u.Id));

            var staffMembers = await staffQuery.ToListAsync(cancellationToken);

            return new ListStaffResponse
            {
                StaffMembers = staffMembers.Select(s => new StaffResponse
                {
                    Id = s.Id,
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    Email = s.Email!,
                    Position = s.Position,
                    DepartmentId = s.DepartmentId,
                    DepartmentName = s.Department?.Name,
                    IsActive = s.IsActive,
                    LastLogin = s.LastLogin
                }).ToList()
            };
        }
    }
}

public class ListStaffEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/staff", async (IMediator mediator) =>
        {
            var query = new ListStaff.Query();

            var response = await mediator.Send(query);

            return Results.Ok(response);
        })
        .RequireAuthorization()
        .WithTags("Staff")
        .WithName("ListStaff")
        .WithDescription("Get list of staff")
        .Produces<ListDepartmentsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
