using FluentValidation;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Wards;

public class CreateWardRequest
{
    public Guid DepartmentId { get; set; }
    public Guid WardTypeId { get; set; }
    public string WardNumber { get; set; } = string.Empty;
    public WardGenderPolicy GenderPolicy { get; set; }
    public int MaxCapacity { get; set; }
    public string? Notes { get; set; }
}

public class CreateWardRequestValidator : AbstractValidator<CreateWardRequest>
{
    public CreateWardRequestValidator()
    {
        RuleFor(x => x.DepartmentId)
            .NotEmpty().WithMessage("Department ID is required.");

        RuleFor(x => x.WardTypeId)
            .NotEmpty().WithMessage("Ward Type ID is required.");

        RuleFor(x => x.WardNumber)
            .NotEmpty().WithMessage("Ward number is required.")
            .MaximumLength(50).WithMessage("Ward number cannot exceed 50 characters.");

        RuleFor(x => x.GenderPolicy)
            .IsInEnum().WithMessage("Invalid gender policy value.");

        RuleFor(x => x.MaxCapacity)
            .GreaterThan(0).WithMessage("Maximum capacity must be greater than 0.");

        RuleFor(x => x.Notes)
            .MaximumLength(500).WithMessage("Notes cannot exceed 500 characters.");
    }
}