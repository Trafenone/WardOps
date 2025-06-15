namespace WardOps.API.Contracts.WardTypes;

public class ListWardTypesResponse
{
    public ICollection<WardTypeResponse> WardTypes { get; set; } = new List<WardTypeResponse>();
}
