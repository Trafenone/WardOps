using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Patients;

public class PatientResponse
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}";
    public DateTime DateOfBirth { get; set; }
    public int Age => CalculateAge(DateOfBirth);
    public Gender Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public string? MedicalCardNumber { get; set; }
    public string? AdmissionDiagnosis { get; set; }
    public bool RequiresIsolation { get; set; }
    public string? Notes { get; set; }

    private static int CalculateAge(DateTime birthDate)
    {
        var today = DateTime.Today;
        var age = today.Year - birthDate.Year;
        if (birthDate > today.AddYears(-age))
            age--;

        return age;
    }
}
