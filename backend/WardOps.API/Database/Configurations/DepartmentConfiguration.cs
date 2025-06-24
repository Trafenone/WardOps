using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WardOps.API.Entities;

namespace WardOps.API.Database.Configurations;

public class DepartmentConfiguration : IEntityTypeConfiguration<Department>
{
    public void Configure(EntityTypeBuilder<Department> builder)
    {
        builder.HasKey(d => d.Id);

        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(d => d.Building)
            .HasMaxLength(100);

        builder.Property(d => d.Description)
            .HasMaxLength(500);

        builder.HasMany(d => d.Wards)
            .WithOne(w => w.Department)
            .HasForeignKey(w => w.DepartmentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
