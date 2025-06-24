using Carter;
using MediatR;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Dashboard;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Dashboard;

public static class GetRecentBedActivities
{
    public class Query : IRequest<ListRecentBedActivityResponse>
    {
        public int Limit { get; init; } = 5;
    }

    internal sealed class Handler : IRequestHandler<Query, ListRecentBedActivityResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ListRecentBedActivityResponse> Handle(Query request, CancellationToken cancellationToken)
        {
            var activities = await _dbContext.BedEventLogs
                .AsNoTracking()
                .Include(bel => bel.User)
                .Include(bel => bel.Patient)
                .Include(bel => bel.Bed)
                .OrderByDescending(bel => bel.Timestamp)
                .Take(request.Limit)
                .ToListAsync(cancellationToken);

            return new ListRecentBedActivityResponse
            {
                Activities = activities.Select(log => new RecentBedActivityResponse
                {
                    Id = log.Id,
                    Timestamp = log.Timestamp,
                    UserName = log.User != null ? $"{log.User.FirstName} {log.User.LastName}" : "Система",
                    Description = GenerateDescription(log)
                }).ToList()
            };
        }

        private static string GenerateDescription(BedEventLog log)
        {
            var patientName = log.Patient != null ? $"{log.Patient.FirstName} {log.Patient.LastName}" : "";
            var bedNumber = log.Bed?.BedNumber ?? "невідомого ліжка";

            return log.EventType switch
            {
                BedEventType.Occupied => $"призначив(ла) пацієнта {patientName} на ліжко №{bedNumber}",
                BedEventType.Freed => $"виписав(ла) пацієнта {patientName} з ліжка №{bedNumber}",
                BedEventType.CleaningStarted => $"розпочав(ла) прибирання ліжка №{bedNumber}",
                BedEventType.CleaningFinished => $"завершив(ла) прибирання ліжка №{bedNumber}",
                BedEventType.MaintenanceScheduled => $"запланував(ла) обслуговування ліжка №{bedNumber}",
                BedEventType.MaintenanceCompleted => $"завершив(ла) обслуговування ліжка №{bedNumber}",
                BedEventType.ReservationCreated => $"зарезервував(ла) ліжко №{bedNumber}",
                BedEventType.ReservationCancelled => $"скасував(ла) резервацію для ліжка №{bedNumber}",
                BedEventType.StatusManuallyChanged => $"змінив(ла) статус ліжка №{bedNumber} вручну",
                _ => $"виконав(ла) дію '{log.EventType}' з ліжком №{bedNumber}"
            };
        }
    }
}

public class RecentActivityEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/dashboard/recent-bed-activity", async (ISender sender) =>
        {
            var query = new GetRecentBedActivities.Query();

            var result = await sender.Send(query);

            return Results.Ok(result);
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Dashboard")
        .WithName("GetRecentBedActivities")
        .WithDescription("Gets a list of recent bed activities for the admin dashboard.")
        .Produces<ListRecentBedActivityResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
