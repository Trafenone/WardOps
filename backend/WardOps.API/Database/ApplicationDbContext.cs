using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Entities;

namespace WardOps.API.Database;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        var adminRoleId = "a18be9c0-aa65-4af8-bd17-00bd9344e575";
        var staffRoleId = "136bf839-a5ce-47e0-8a7c-506c8c18254c";

        builder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = adminRoleId, Name = "Admin", NormalizedName = "ADMIN" },
            new IdentityRole { Id = staffRoleId, Name = "Staff", NormalizedName = "STAFF" }
        );
    }

    public DbSet<Department> Departments { get; set; }
    public DbSet<WardType> WardTypes { get; set; }
    public DbSet<Ward> Wards { get; set; }
    public DbSet<Bed> Beds { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Hospitalization> Hospitalizations { get; set; }
    public DbSet<BedEventLog> BedEventLogs { get; set; }
}
