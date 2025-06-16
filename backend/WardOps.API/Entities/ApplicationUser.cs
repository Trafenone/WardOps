using Microsoft.AspNetCore.Identity;
using WardOps.API.Entities.Enums;

namespace WardOps.API.Entities;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public PositionType Position { get; set; }
    public Guid? DepartmentId { get; set; }
    public Department? Department { get; set; }
    public DateTime? LastLogin { get; set; }
    public bool IsActive { get; set; }

    public ICollection<BedEventLog> BedEventLogs { get; set; } = new List<BedEventLog>();
}
