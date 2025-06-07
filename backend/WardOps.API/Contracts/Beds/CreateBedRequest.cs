using FluentValidation;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Beds;

public class CreateBedRequest
{
    public Guid WardId { get; set; }
    public string BedNumber { get; set; } = string.Empty;
    public BedStatus Status { get; set; } = BedStatus.Available;
    public string? Notes { get; set; }
}

public class CreateBedRequestValidator : AbstractValidator<CreateBedRequest>
{
    public CreateBedRequestValidator()
    {
        RuleFor(x => x.WardId)
            .NotEmpty().WithMessage("Ward ID is required.");

        RuleFor(x => x.BedNumber)
            .NotEmpty().WithMessage("Bed number is required.")
            .MaximumLength(20).WithMessage("Bed number cannot exceed 20 characters.");

        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Invalid bed status value.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters.");
    }
}