namespace WardOps.API.Contracts.Departments;

using FluentValidation;

public class UpdateDepartmentRequest : CreateDepartmentRequest
{
}

public class UpdateDepartmentRequestValidator : AbstractValidator<UpdateDepartmentRequest> 
{
    public UpdateDepartmentRequestValidator()
    {
        Include(new CreateDepartmentRequestValidator());
    }
}
