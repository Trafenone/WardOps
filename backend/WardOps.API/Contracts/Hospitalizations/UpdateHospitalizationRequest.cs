using FluentValidation;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Hospitalizations;

public class UpdateHospitalizationRequest
{
    public Guid BedId { get; set; }
    public DateTime AdmissionDateTime { get; set; }
    public DateTime? PlannedDischargeDateTime { get; set; }
    public DateTime? ActualDischargeDateTime { get; set; }
    public string? AdmissionReason { get; set; }
    public string? DischargeReason { get; set; }
    public HospitalizationStatus Status { get; set; }
}

public class UpdateHospitalizationRequestValidator : AbstractValidator<UpdateHospitalizationRequest>
{
    public UpdateHospitalizationRequestValidator()
    {
        RuleFor(x => x.BedId)
            .NotEmpty().WithMessage("BedId is required");

        RuleFor(x => x.AdmissionDateTime)
            .NotEmpty().WithMessage("AdmissionDateTime is required")
            .Must(date => date <= DateTime.UtcNow).WithMessage("AdmissionDateTime cannot be in the future");

        RuleFor(x => x.PlannedDischargeDateTime)
            .GreaterThan(x => x.AdmissionDateTime)
            .When(x => x.PlannedDischargeDateTime.HasValue)
            .WithMessage("PlannedDischargeDateTime must be later than the AdmissionDateTime");

        RuleFor(x => x.ActualDischargeDateTime)
            .GreaterThan(x => x.AdmissionDateTime)
            .When(x => x.ActualDischargeDateTime.HasValue)
            .WithMessage("ActualDischargeDateTime must be later than the AdmissionDateTime");

        RuleFor(x => x.AdmissionReason)
            .MaximumLength(1000).WithMessage("AdmissionReason cannot exceed 1000 characters");

        RuleFor(x => x.DischargeReason)
            .MaximumLength(1000).WithMessage("DischargeReason cannot exceed 1000 characters");
    }
}