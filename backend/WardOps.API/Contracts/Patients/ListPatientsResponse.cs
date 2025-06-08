namespace WardOps.API.Contracts.Patients;

public class ListPatientsResponse
{
    public ICollection<PatientResponse> Patients { get; set; } = new List<PatientResponse>();
}