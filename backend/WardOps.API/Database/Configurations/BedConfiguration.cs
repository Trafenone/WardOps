using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WardOps.API.Entities;

namespace WardOps.API.Database.Configurations;

public class BedConfiguration : IEntityTypeConfiguration<Bed>
{
    public void Configure(EntityTypeBuilder<Bed> builder)
    {
        builder.HasKey(b => b.Id);

        builder.Property(b => b.BedNumber)
            .IsRequired()
            .HasMaxLength(20);

        builder.Property(b => b.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.Property(b => b.Notes)
            .HasMaxLength(500);

        builder.HasIndex(b => new { b.WardId, b.BedNumber })
            .IsUnique();

        builder.HasOne(b => b.Ward)
            .WithMany(w => w.Beds)
            .HasForeignKey(b => b.WardId)
            .IsRequired();

        builder.HasMany(b => b.Hospitalizations)
            .WithOne(h => h.Bed)
            .HasForeignKey(h => h.BedId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(b => b.EventLogs)
            .WithOne(bel => bel.Bed)
            .HasForeignKey(bel => bel.BedId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
