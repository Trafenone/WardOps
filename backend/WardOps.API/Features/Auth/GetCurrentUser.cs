using Carter;
using MediatR;
using Microsoft.AspNetCore.Identity;
using WardOps.API.Contracts.Auth;
using WardOps.API.Entities;
using WardOps.API.Services;

namespace WardOps.API.Features.Auth;

public static class GetCurrentUser
{
    public class Query : IRequest<UserResponse?>
    {
    }

    internal sealed class Handler : IRequestHandler<Query, UserResponse?>
    {
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<ApplicationUser> _userManager;

        public Handler(ICurrentUserService currentUserService, UserManager<ApplicationUser> userManager)
        {
            _currentUserService = currentUserService;
            _userManager = userManager;
        }

        public async Task<UserResponse?> Handle(Query request, CancellationToken cancellationToken)
        {
            var user = await _currentUserService.GetCurrentUserAsync();

            if (user == null)
                return null;

            var roles = await _userManager.GetRolesAsync(user);

            return new UserResponse
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Position = user.Position,
                Roles = roles.ToList()
            };
        }
    }
}

public class GetCurrentUserEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/auth/me", async (ISender sender) =>
        {
            var query = new GetCurrentUser.Query();

            var result = await sender.Send(query);

            if (result == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(result);
        })
        .WithTags("Authentication")
        .WithName("GetCurrentUser")
        .WithDescription("Gets information about the currently authenticated user")
        .Produces<UserResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .RequireAuthorization();
    }
}