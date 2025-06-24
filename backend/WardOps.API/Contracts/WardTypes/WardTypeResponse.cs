namespace WardOps.API.Contracts.WardTypes;

public class WardTypeResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
