namespace WardOps.API.Contracts.Patients;

public class ListPatientHospitalizationsResponse
{
    public Guid PatientId { get; set; }
    public string PatientFullName { get; set; } = string.Empty;
    public ICollection<PatientHospitalizationResponse> Hospitalizations { get; set; } = new List<PatientHospitalizationResponse>();
}