namespace WardOps.API.Contracts.Dashboard;

public class RecentBedActivityResponse
{
    public Guid Id { get; set; }
    public DateTime Timestamp { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? UserName { get; set; }
}
