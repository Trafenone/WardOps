using Carter;
using MediatR;
using Microsoft.AspNetCore.Identity;
using WardOps.API.Common;
using WardOps.API.Entities;

namespace WardOps.API.Features.Auth;

public static class AssignAdminRole
{
    public class Command : IRequest<bool>
    {
        public string UserId { get; set; } = string.Empty;
    }

    internal sealed class Handler : IRequestHandler<Command, bool>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public Handler(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<bool> Handle(Command request, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByIdAsync(request.UserId);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found");
            }

            if (await _userManager.IsInRoleAsync(user, "Admin"))
            {
                return true;
            }

            var result = await _userManager.AddToRoleAsync(user, "Admin");

            return result.Succeeded;
        }
    }
}

public class AssignAdminRoleEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/auth/assign-admin/{userId}", async (string userId, ISender sender) =>
        {
            var command = new AssignAdminRole.Command { UserId = userId };

            var result = await sender.Send(command);
            if (result)
            {
                return Results.Ok(new { message = "User has been assigned to Admin role" });
            }

            return Results.BadRequest(new { message = "Failed to assign Admin role" });
        })
        .RequireAuthorization(AuthorizationPolicies.AdminPolicy)
        .WithTags("Authentication")
        .WithName("AssignAdminRole")
        .WithDescription("Assigns the Admin role to a user (requires admin privileges)")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound);
    }
}