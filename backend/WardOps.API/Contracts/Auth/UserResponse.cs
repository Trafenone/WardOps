using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Auth;

public class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public PositionType Position { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
}