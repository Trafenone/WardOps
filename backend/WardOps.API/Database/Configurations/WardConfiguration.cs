using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WardOps.API.Entities;

namespace WardOps.API.Database.Configurations;

public class WardConfiguration : IEntityTypeConfiguration<Ward>
{
    public void Configure(EntityTypeBuilder<Ward> builder)
    {
        builder.HasKey(w => w.Id);

        builder.Property(w => w.WardNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(w => w.GenderPolicy)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(w => w.MaxCapacity)
            .IsRequired();

        builder.Property(w => w.Notes)
            .HasMaxLength(1000);

        builder.HasOne(w => w.Department)
           .WithMany(d => d.Wards)
           .HasForeignKey(w => w.DepartmentId)
           .IsRequired();

        builder.HasOne(w => w.WardType)
            .WithMany(wt => wt.Wards)
            .HasForeignKey(w => w.WardTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(w => w.Beds)
            .WithOne(b => b.Ward)
            .HasForeignKey(b => b.WardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
