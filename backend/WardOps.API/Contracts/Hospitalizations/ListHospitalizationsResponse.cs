namespace WardOps.API.Contracts.Hospitalizations;

public class ListHospitalizationsResponse
{
    public ICollection<HospitalizationResponse> Hospitalizations { get; set; } = new List<HospitalizationResponse>();
}