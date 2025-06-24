using WardOps.API.Entities.Enums;

namespace WardOps.API.Entities;

public class BedEventLog
{
    public Guid Id { get; set; }
    public Guid BedId { get; set; }
    public Bed Bed { get; set; } = null!;
    public BedEventType EventType { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? UserId { get; set; }
    public ApplicationUser? User { get; set; }
    public Guid? PatientId { get; set; }
    public Patient? Patient { get; set; }
    public string? Notes { get; set; }
}
