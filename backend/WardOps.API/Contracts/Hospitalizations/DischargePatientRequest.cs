using FluentValidation;

namespace WardOps.API.Contracts.Hospitalizations;

public class DischargePatientRequest
{
    public string? DischargeReason { get; set; }
    public DateTime? ActualDischargeDateTime { get; set; }
}

public class DischargePatientRequestValidator : AbstractValidator<DischargePatientRequest>
{
    public DischargePatientRequestValidator()
    {
        RuleFor(x => x.DischargeReason)
            .MaximumLength(1000).WithMessage("DischargeReason cannot exceed 1000 characters");
    }
}
