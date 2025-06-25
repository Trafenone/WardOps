using WardOps.API.Entities.Enums;

namespace WardOps.API.Entities;

public class Patient
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public string? MedicalCardNumber { get; set; }
    public string? AdmissionDiagnosis { get; set; }
    public bool RequiresIsolation { get; set; }
    public string? Notes { get; set; }
    public PatientStatus Status { get; set; }

    public ICollection<Hospitalization> Hospitalizations { get; set; } = new List<Hospitalization>();

    public string GetFullName => $"{FirstName} {LastName}";
}
