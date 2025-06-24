using FluentValidation;

namespace WardOps.API.Contracts.Wards;

public class UpdateWardRequest : CreateWardRequest
{
}

public class UpdateWardRequestValidator : AbstractValidator<UpdateWardRequest>
{
    public UpdateWardRequestValidator()
    {
        Include(new CreateWardRequestValidator());
    }
}