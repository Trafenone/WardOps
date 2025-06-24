namespace WardOps.API.Contracts.Dashboard;

public class AdminDashboardStatsResponse
{
    public int TotalActivePatients { get; set; }
    public int OccupiedBeds { get; set; }
    public int TotalBeds { get; set; }
    public double BedOccupancyPercentage { get; set; }
    public int TotalDepartments { get; set; }
}
