using FluentValidation;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Beds;

public class ChangeBedStatusRequest
{
    public BedStatus Status { get; set; }
    public string? Notes { get; set; }
}

public class ChangeBedStatusRequestValidator : AbstractValidator<ChangeBedStatusRequest>
{
    public ChangeBedStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid bed status value.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters.");
    }
}
