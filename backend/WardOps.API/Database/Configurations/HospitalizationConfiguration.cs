using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WardOps.API.Entities;

namespace WardOps.API.Database.Configurations;

public class HospitalizationConfiguration : IEntityTypeConfiguration<Hospitalization>
{
    public void Configure(EntityTypeBuilder<Hospitalization> builder)
    {
        builder.HasKey(h => h.Id);

        builder.Property(h => h.AdmissionDateTime)
            .IsRequired();

        builder.Property(h => h.AdmissionReason)
            .HasMaxLength(1000);

        builder.Property(h => h.DischargeReason)
            .HasMaxLength(1000);

        builder.Property(h => h.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        builder.HasOne(h => h.Patient)
            .WithMany(p => p.Hospitalizations)
            .HasForeignKey(h => h.PatientId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(h => h.Bed)
            .WithMany(b => b.Hospitalizations)
            .HasForeignKey(h => h.BedId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Restrict);
    }
}
