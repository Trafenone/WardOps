using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using WardOps.API.Contracts.Auth;
using WardOps.API.Entities;
using WardOps.API.Services;

namespace WardOps.API.Features.Auth;

public static class Register
{
    public class Command : IRequest<AuthResponse>
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
    }

    internal sealed class Handler : IRequestHandler<Command, AuthResponse>
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenService _tokenService;

        public Handler(UserManager<ApplicationUser> userManager, ITokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        public async Task<AuthResponse> Handle(Command request, CancellationToken cancellationToken)
        {
            var userExists = await _userManager.FindByEmailAsync(request.Email);
            if (userExists != null)
            {
                throw new InvalidOperationException("User with this email already exists.");
            }

            var user = new ApplicationUser
            {
                Email = request.Email,
                UserName = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Position = request.Position,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException("User registration failed: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            await _userManager.AddToRoleAsync(user, "Staff");

            var token = await _tokenService.GenerateTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            return new AuthResponse
            {
                Token = token,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Position = user.Position,
                Roles = roles.ToList()
            };
        }
    }
}

public class RegisterEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/auth/register", async (RegisterRequest request, ISender sender, IValidator<RegisterRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new Register.Command
            {
                Email = request.Email,
                Password = request.Password,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Position = request.Position
            };

            var result = await sender.Send(command);

            return Results.Created($"/api/auth/users/{result.Email}", result);
        })
        .WithTags("Authentication")
        .WithName("Register")
        .WithDescription("Registers a new user and returns a JWT token")
        .Produces<AuthResponse>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}