using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using WardOps.API.Entities;

namespace WardOps.API.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly UserManager<ApplicationUser> _userManager;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor, UserManager<ApplicationUser> userManager)
    {
        _httpContextAccessor = httpContextAccessor;
        _userManager = userManager;
    }

    public async Task<ApplicationUser?> GetCurrentUserAsync()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return null;

        return await _userManager.FindByIdAsync(userId);
    }

    public string? GetCurrentUserId()
    {
        return _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
    }
}