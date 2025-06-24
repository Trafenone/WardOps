using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WardOps.API.Entities;

namespace WardOps.API.Database.Configurations;

public class BedEventLogConfiguration : IEntityTypeConfiguration<BedEventLog>
{
    public void Configure(EntityTypeBuilder<BedEventLog> builder)
    {
        builder.HasKey(bel => bel.Id);

        builder.Property(bel => bel.EventType)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(30);

        builder.Property(bel => bel.Timestamp)
            .IsRequired();

        builder.Property(bel => bel.Notes)
            .HasMaxLength(500);

        builder.HasOne(bel => bel.Bed)
            .WithMany(b => b.EventLogs)
            .HasForeignKey(bel => bel.BedId)
            .IsRequired();

        builder.HasOne(bel => bel.User)
            .WithMany(u => u.BedEventLogs)
            .HasForeignKey(bel => bel.UserId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(bel => bel.Patient)
            .WithMany()
            .HasForeignKey(bel => bel.PatientId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
