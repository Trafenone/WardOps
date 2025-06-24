using FluentValidation;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Patients;

public class UpdatePatientRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime DateOfBirth { get; set; }
    public Gender Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public string? MedicalCardNumber { get; set; }
    public string? AdmissionDiagnosis { get; set; }
    public bool RequiresIsolation { get; set; }
    public PatientStatus Status { get; set; }
    public string? Notes { get; set; }
}

public class UpdatePatientRequestValidator : AbstractValidator<UpdatePatientRequest>
{
    public UpdatePatientRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required.")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required.")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters.");

        RuleFor(x => x.DateOfBirth)
            .NotEmpty().WithMessage("Date of birth is required.")
            .LessThanOrEqualTo(DateTime.Today).WithMessage("Date of birth must be in the past.");

        RuleFor(x => x.Gender)
            .IsInEnum().WithMessage("Invalid gender value.");

        RuleFor(x => x.PhoneNumber)
            .MaximumLength(100).WithMessage("Phone number cannot exceed 100 characters.");

        RuleFor(x => x.MedicalCardNumber)
            .MaximumLength(100).WithMessage("Medical card number cannot exceed 100 characters.");

        RuleFor(x => x.AdmissionDiagnosis)
            .MaximumLength(500).WithMessage("Admission diagnosis cannot exceed 500 characters.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid status value.");

        RuleFor(x => x.Notes)
            .MaximumLength(1000).WithMessage("Notes cannot exceed 1000 characters.");
    }
}