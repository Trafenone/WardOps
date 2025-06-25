using Carter;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Contracts.Auth;
using WardOps.API.Database;
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
        private readonly ApplicationDbContext _dbContext;
        private readonly ICurrentUserService _currentUserService;
        private readonly UserManager<ApplicationUser> _userManager;

        public Handler(ApplicationDbContext dbContext, ICurrentUserService currentUserService, UserManager<ApplicationUser> userManager)
        {
            _dbContext = dbContext;
            _currentUserService = currentUserService;
            _userManager = userManager;
        }

        public async Task<UserResponse?> Handle(Query request, CancellationToken cancellationToken)
        {
            var userId = _currentUserService.GetCurrentUserId();
            if (userId == null)
                return null;

            var user = await _dbContext.Users
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
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
                DepartmentId = user.DepartmentId,
                DepartmentName = user.Department?.Name,
                Role = roles.FirstOrDefault() ?? ""
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
        .RequireAuthorization()
        .WithTags("Authentication")
        .WithName("GetCurrentUser")
        .WithDescription("Gets information about the currently authenticated user")
        .Produces<UserResponse>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound);
    }
}