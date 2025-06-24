namespace WardOps.API.Entities;

public class WardType
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<Ward> Wards { get; set; } = new List<Ward>();
}
