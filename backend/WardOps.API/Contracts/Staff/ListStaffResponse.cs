namespace WardOps.API.Contracts.Staff;

public class ListStaffResponse
{
    public ICollection<StaffResponse> StaffMembers { get; set; } = new List<StaffResponse>();
}
