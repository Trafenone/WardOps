using WardOps.API.Entities.Enums;

namespace WardOps.API.Entities;

public class Hospitalization
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public Patient Patient { get; set; } = null!;
    public Guid BedId { get; set; }
    public Bed Bed { get; set; } = null!;
    public DateTime AdmissionDateTime { get; set; }
    public DateTime? PlannedDischargeDateTime { get; set; }
    public DateTime? ActualDischargeDateTime { get; set; }
    public string? AdmissionReason { get; set; }
    public string? DischargeReason { get; set; }
    public HospitalizationStatus Status { get; set; }
}
