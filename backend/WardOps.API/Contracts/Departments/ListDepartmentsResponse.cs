namespace WardOps.API.Contracts.Departments;

public class ListDepartmentsResponse
{
    public ICollection<DepartmentResponse> Departments { get; set; } = new List<DepartmentResponse>();
}
