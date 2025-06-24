using FluentValidation;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Beds;

public class UpdateBedRequest
{
    public string BedNumber { get; set; } = string.Empty;
    public BedStatus Status { get; set; }
    public string? Notes { get; set; }
}

public class UpdateBedRequestValidator : AbstractValidator<UpdateBedRequest>
{
    public UpdateBedRequestValidator()
    {
        RuleFor(x => x.BedNumber)
            .NotEmpty().WithMessage("Bed number is required.")
            .MaximumLength(20).WithMessage("Bed number cannot exceed 20 characters.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid bed status value.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters.");
    }
}