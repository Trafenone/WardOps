using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Contracts.Staff;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Features.Staff;

public class CreateStaff
{
    public class Command : IRequest<StaffResponse>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
        public PositionType Position { get; set; }
        public Guid DepartmentId { get; set; }
        public bool IsActive { get; set; }
    }

    internal sealed class Handler : IRequestHandler<Command, StaffResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _dbContext;

        public Handler(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
        {
            _userManager = userManager;
            _dbContext = dbContext;
        }

        public async Task<StaffResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
            {
                throw new InvalidOperationException("Staff with this email already exists.");
            }

            var department = await _dbContext.Departments.FirstOrDefaultAsync(d => d.Id == request.DepartmentId, cancellationToken);
            if (department == null)
            {
                throw new KeyNotFoundException("Department not found.");
            }

            var user = new ApplicationUser
            {
                Email = request.Email,
                UserName = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Position = request.Position,
                DepartmentId = request.DepartmentId,
                IsActive = request.IsActive,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException("Staff registration failed: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            await _userManager.AddToRoleAsync(user, Roles.Staff);

            return new StaffResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Position = user.Position,
                DepartmentId = user.DepartmentId,
                DepartmentName = department.Name,
                IsActive = user.IsActive
            };
        }
    }
}

public class CreateStaffEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/staff", async (CreateStaffRequest request, IMediator mediator, IValidator<CreateStaffRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new CreateStaff.Command
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password,
                ConfirmPassword = request.ConfirmPassword,
                Position = request.Position,
                DepartmentId = request.DepartmentId,
                IsActive = request.IsActive
            };

            var response = await mediator.Send(command);

            return Results.Created($"/api/staff/{response.Id}", response);
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Staff")
        .WithName("CreateStaff")
        .WithDescription("Creates a new staff")
        .Produces<StaffResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}