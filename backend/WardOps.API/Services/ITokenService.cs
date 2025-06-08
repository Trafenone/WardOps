using WardOps.API.Entities;

namespace WardOps.API.Services;

public interface ITokenService
{
    Task<string> GenerateTokenAsync(ApplicationUser user);
}