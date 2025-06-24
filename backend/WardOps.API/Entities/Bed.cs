using WardOps.API.Entities.Enums;

namespace WardOps.API.Entities;

public class Bed
{
    public Guid Id { get; set; }
    public Guid WardId { get; set; }
    public Ward Ward { get; set; } = null!;
    public string BedNumber { get; set; } = string.Empty;
    public BedStatus Status { get; set; }
    public string? Notes { get; set; }
    
    public ICollection<Hospitalization> Hospitalizations { get; set; } = new List<Hospitalization>();
    public ICollection<BedEventLog> EventLogs { get; set; } = new List<BedEventLog>();
}
