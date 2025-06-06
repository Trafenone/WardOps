using WardOps.API.Entities.Enums;

namespace WardOps.API.Entities;

public class Ward
{
    public Guid Id { get; set; }
    public Guid DepartmentId { get; set; }
    public Department Department { get; set; } = null!;
    public Guid WardTypeId { get; set; }
    public WardType WardType { get; set; } = null!;
    public string WardNumber { get; set; } = string.Empty;
    public WardGenderPolicy GenderPolicy { get; set; }
    public int MaxCapacity { get; set; }
    public string? Notes { get; set; }

    public ICollection<Bed> Beds { get; set; } = new List<Bed>();
}
