using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Hospitalizations;

public class HospitalizationResponse
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
    public string PatientFullName { get; set; } = string.Empty;
    public Guid BedId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public string WardNumber { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;
    public DateTime AdmissionDateTime { get; set; }
    public DateTime? PlannedDischargeDateTime { get; set; }
    public DateTime? ActualDischargeDateTime { get; set; }
    public string? AdmissionReason { get; set; }
    public string? DischargeReason { get; set; }
    public HospitalizationStatus Status { get; set; }
}