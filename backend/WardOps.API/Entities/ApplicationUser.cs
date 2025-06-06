using Microsoft.AspNetCore.Identity;

namespace WardOps.API.Entities;

public class ApplicationUser : IdentityUser
{
    public string Position { get; set; } = string.Empty;
}
