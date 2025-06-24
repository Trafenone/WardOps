using FluentValidation;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Hospitalizations;

public class CreateHospitalizationRequest
{
    public Guid PatientId { get; set; }
    public Guid BedId { get; set; }
    public DateTime AdmissionDateTime { get; set; }
    public DateTime? PlannedDischargeDateTime { get; set; }
    public string? AdmissionReason { get; set; }
    public HospitalizationStatus Status { get; set; }
}

public class CreateHospitalizationRequestValidator : AbstractValidator<CreateHospitalizationRequest>
{
    public CreateHospitalizationRequestValidator()
    {
        RuleFor(x => x.PatientId)
            .NotEmpty().WithMessage("PatientId is required");

        RuleFor(x => x.BedId)
            .NotEmpty().WithMessage("BedId is required");

        RuleFor(x => x.AdmissionDateTime)
            .NotEmpty().WithMessage("AdmissionDateTime is required")
            .Must(date => date <= DateTime.UtcNow).WithMessage("AdmissionDateTime cannot be in the future");

        RuleFor(x => x.PlannedDischargeDateTime)
            .GreaterThan(x => x.AdmissionDateTime)
            .When(x => x.PlannedDischargeDateTime.HasValue)
            .WithMessage("PlannedDischargeDateTime must be later than the AdmissionDateTime");

        RuleFor(x => x.AdmissionReason)
            .MaximumLength(1000).WithMessage("AdmissionReason cannot exceed 1000 characters");
    }
}