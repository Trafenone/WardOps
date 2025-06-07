namespace WardOps.API.Contracts.Departments;

using FluentValidation;

public class CreateDepartmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string? Building { get; set; }
    public int? FloorNumber { get; set; }
    public string? Description { get; set; }
}

public class CreateDepartmentRequestValidator : AbstractValidator<CreateDepartmentRequest>
{
    public CreateDepartmentRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Department name is required.")
            .MaximumLength(200).WithMessage("Department name cannot exceed 200 characters.");

        RuleFor(x => x.Building)
            .MaximumLength(100)
            .WithMessage("Building cannot exceed 100 characters");

        RuleFor(x => x.FloorNumber)
            .GreaterThan(0).When(x => x.FloorNumber.HasValue)
            .WithMessage("Floor number must be greater than 0 if provided.");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters.");
    }
}
