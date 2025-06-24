using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Patients;

public class PatientHospitalizationResponse
{
    public Guid Id { get; set; }
    public Guid PatientId { get; set; }
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