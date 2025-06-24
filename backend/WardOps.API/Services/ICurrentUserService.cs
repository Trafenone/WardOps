using WardOps.API.Entities;

namespace WardOps.API.Services;

public interface ICurrentUserService
{
    Task<ApplicationUser?> GetCurrentUserAsync();
    string? GetCurrentUserId();
}