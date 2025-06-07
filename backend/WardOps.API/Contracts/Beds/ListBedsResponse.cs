namespace WardOps.API.Contracts.Beds;

public class ListBedsResponse
{
    public ICollection<BedResponse> Beds { get; set; } = new List<BedResponse>();
}