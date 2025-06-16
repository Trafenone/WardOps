using Carter;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using WardOps.API.Contracts.Auth;
using WardOps.API.Entities;
using WardOps.API.Services;

namespace WardOps.API.Features.Auth;

public static class Login
{
    public class Command : IRequest<AuthResponse>
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
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
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                throw new InvalidOperationException("Invalid email or password");
            }

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!isPasswordValid)
            {
                throw new InvalidOperationException("Invalid email or password");
            }

            var token = await _tokenService.GenerateTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);

            return new AuthResponse
            {
                Token = token,
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Position = user.Position,
                Role = roles.FirstOrDefault() ?? ""
            };
        }
    }
}

public class LoginEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/auth/login", async (LoginRequest request, ISender sender, IValidator<LoginRequest> validator) =>
        {
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return Results.ValidationProblem(validationResult.ToDictionary());
            }

            var command = new Login.Command
            {
                Email = request.Email,
                Password = request.Password
            };

            var result = await sender.Send(command);

            return Results.Ok(result);
        })
        .WithTags("Authentication")
        .WithName("Login")
        .WithDescription("Authenticates a user and returns a JWT token")
        .Produces<AuthResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status500InternalServerError);
    }
}