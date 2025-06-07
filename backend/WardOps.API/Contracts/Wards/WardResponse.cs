namespace WardOps.API.Contracts.Wards;

using WardOps.API.Entities.Enums;

public class WardResponse
{
    public Guid Id { get; set; }
    public Guid DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public Guid WardTypeId { get; set; }
    public string WardTypeName { get; set; } = string.Empty;
    public string WardNumber { get; set; } = string.Empty;
    public WardGenderPolicy GenderPolicy { get; set; }
    public int MaxCapacity { get; set; }
    public string? Notes { get; set; }
}