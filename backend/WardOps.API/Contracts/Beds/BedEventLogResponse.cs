using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Beds;

public class BedEventLogResponse
{
    public Guid Id { get; set; }
    public Guid BedId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public BedEventType EventType { get; set; }
    public DateTime Timestamp { get; set; }
    public string? UserId { get; set; }
    public string? UserName { get; set; }
    public Guid? PatientId { get; set; }
    public string? PatientFullName { get; set; }
    public string? Notes { get; set; }
}

public class ListBedEventLogsResponse
{
    public ICollection<BedEventLogResponse> EventLogs { get; set; } = new List<BedEventLogResponse>();
}