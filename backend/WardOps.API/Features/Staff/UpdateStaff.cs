using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Departments;
using WardOps.API.Contracts.Staff;
using WardOps.API.Database;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Staff;

public class UpdateStaff
{
    public class Command : IRequest<StaffResponse>
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public PositionType Position { get; set; }
        public Guid DepartmentId { get; set; }
        public bool IsActive { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, StaffResponse>
    {
        private readonly ApplicationDbContext _dbContext;

        public Handler(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<StaffResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            var staff = await _dbContext.Users.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
            if (staff == null)
            {
                throw new KeyNotFoundException("Staff not found.");
            }

            staff.FirstName = request.FirstName;
            staff.LastName = request.LastName;
            staff.Position = request.Position;
            staff.DepartmentId = request.DepartmentId;
            staff.IsActive = request.IsActive;

            _dbContext.Update(staff);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return new StaffResponse
            {
                Id = staff.Id,
                FirstName = staff.FirstName,
                LastName = staff.LastName,
                Email = staff.Email!,
                Position = staff.Position,
                DepartmentId = staff.DepartmentId,
                DepartmentName = staff.Department?.Name,
                IsActive = staff.IsActive,
                LastLogin = staff.LastLogin
            };
        }
    }
}

public class UpdateStaffEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPut("api/staff/{id}", async ([FromRoute] string id, [FromBody] UpdateStaffRequest request, ISender sender, IValidator<UpdateStaffRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new UpdateStaff.Command
            {
                Id = id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Position = request.Position,
                DepartmentId = request.DepartmentId,
                IsActive = request.IsActive
            };

            var result = await sender.Send(command);

            return Results.Ok(result);
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Staff")
        .WithName("UpdateStaff")
        .WithDescription("Updates an existing staff")
        .Produces<DepartmentResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}
