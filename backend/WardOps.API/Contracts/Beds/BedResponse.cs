using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Beds;

public class BedResponse
{
    public Guid Id { get; set; }
    public Guid WardId { get; set; }
    public string WardNumber { get; set; } = string.Empty;
    public string BedNumber { get; set; } = string.Empty;
    public BedStatus Status { get; set; }
    public string? Notes { get; set; }
}