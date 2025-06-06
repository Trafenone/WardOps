using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WardOps.API.Entities;

namespace WardOps.API.Database.Configurations;

public class PatientConfiguration : IEntityTypeConfiguration<Patient>
{
    public void Configure(EntityTypeBuilder<Patient> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(p => p.Gender)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(10);

        builder.Property(p => p.PhoneNumber)
            .HasMaxLength(100);

        builder.Property(p => p.MedicalCardNumber)
            .HasMaxLength(100);

        builder.HasIndex(p => p.MedicalCardNumber)
            .IsUnique();

        builder.Property(p => p.AdmissionDiagnosis)
            .HasMaxLength(500);

        builder.Property(p => p.Notes)
            .HasMaxLength(1000);

        builder.HasMany(p => p.Hospitalizations)
            .WithOne(h => h.Patient)
            .HasForeignKey(h => h.PatientId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
