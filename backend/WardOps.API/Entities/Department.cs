namespace WardOps.API.Entities;

public class Department
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Building { get; set; }
    public int? FloorNumber { get; set; }
    public string? Description { get; set; }
    public ICollection<Ward> Wards { get; set; } = new List<Ward>();
}
