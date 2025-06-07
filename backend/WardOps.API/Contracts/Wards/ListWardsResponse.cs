namespace WardOps.API.Contracts.Wards;

public class ListWardsResponse
{
    public ICollection<WardResponse> Wards { get; set; } = new List<WardResponse>();
}