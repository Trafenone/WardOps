namespace WardOps.API.Contracts.Departments;

public class DepartmentResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Building { get; set; }
    public int? FloorNumber { get; set; }
    public string? Description { get; set; }
}
