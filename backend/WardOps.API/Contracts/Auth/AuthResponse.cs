namespace WardOps.API.Contracts.Auth;

public class AuthResponse
{
    public string? Token { get; set; }
    public string? Id { get; set; }
    public string? Email { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Position { get; set; }
    public List<string> Roles { get; set; } = new List<string>();
}