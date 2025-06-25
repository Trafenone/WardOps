using WardOps.API.Entities.Enums;

namespace WardOps.API.Contracts.Auth;

public class AuthResponse
{
    public string? Token { get; set; }
    public string? Id { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public PositionType Position { get; set; }
    public Guid? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public string Role { get; set; } = null!;
}