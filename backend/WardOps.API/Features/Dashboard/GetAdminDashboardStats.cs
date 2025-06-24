using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Dashboard;
using WardOps.API.Database;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Dashboard;

public static class GetAdminDashboardStats
{
    public class Query : IRequest<AdminDashboardStatsResponse> { }

    internal sealed class Handler : IRequestHandler<Query, AdminDashboardStatsResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<AdminDashboardStatsResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var totalActivePatients = await _dbContext.Hospitalizations
                .CountAsync(h => h.Status == HospitalizationStatus.Active, cancellationToken);

            var totalBeds = await _dbContext.Beds.CountAsync(cancellationToken);

            var occupiedBeds = totalActivePatients;

            var totalDepartments = await _dbContext.Departments.CountAsync(cancellationToken);

            var bedOccupancyPercentage = totalBeds > 0 ? (double)occupiedBeds / totalBeds * 100 : 0;

            return new AdminDashboardStatsResponse
            {
                TotalActivePatients = totalActivePatients,
                OccupiedBeds = occupiedBeds,
                TotalBeds = totalBeds,
                BedOccupancyPercentage = Math.Round(bedOccupancyPercentage, 1),
                TotalDepartments = totalDepartments
            };
        }
    }
}

public class DashboardEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/dashboard/admin-stats", async (ISender sender) =>
        {
            var query = new GetAdminDashboardStats.Query();

            var result = await sender.Send(query);

            return Results.Ok(result);
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Dashboard")
        .WithName("GetAdminDashboardStats")
        .WithDescription("Gets statistics for the admin dashboard.")
        .Produces<AdminDashboardStatsResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
