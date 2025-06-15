using WardOps.API.Contracts.Beds;
using WardOps.API.Contracts.Departments;
using WardOps.API.Contracts.Wards;
using WardOps.API.Contracts.WardTypes;

namespace WardOps.API.Contracts.HospitalStructures;

public class GetHospitalStructureResponse
{
    public ICollection<DepartmentWithWardsResponse> Departments { get; set; } = new List<DepartmentWithWardsResponse>();
}

public class DepartmentWithWardsResponse : DepartmentResponse
{
    public ICollection<WardWithBedsResponse> Wards { get; set; } = new List<WardWithBedsResponse>();
}

public class WardWithBedsResponse : WardResponse
{
    public ICollection<BedResponse> Beds { get; set; } = new List<BedResponse>();
}