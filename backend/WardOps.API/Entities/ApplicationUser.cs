using Microsoft.AspNetCore.Identity;

namespace WardOps.API.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;

    public ICollection<BedEventLog> BedEventLogs { get; set; } = new List<BedEventLog>();
}
