namespace WardOps.API.Contracts.Dashboard;

public class ListRecentBedActivityResponse
{
    public ICollection<RecentBedActivityResponse> Activities { get; set; } = new List<RecentBedActivityResponse>();
}
