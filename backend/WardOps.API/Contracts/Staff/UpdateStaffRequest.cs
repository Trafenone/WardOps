using FluentValidation;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Staff;

public class UpdateStaffRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public PositionType Position { get; set; }
    public Guid DepartmentId { get; set; }
    public bool IsActive { get; set; }
}

public class UpdateStaffRequestValidator : AbstractValidator<UpdateStaffRequest>
{
    public UpdateStaffRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MaximumLength(100).WithMessage("First name cannot exceed 100 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MaximumLength(100).WithMessage("Last name cannot exceed 100 characters");

        RuleFor(x => x.Position)
            .IsInEnum().WithMessage("Invalid position type");

        RuleFor(x => x.DepartmentId)
            .NotEmpty().WithMessage("Department is required");
    }
}
