using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WardOps.API.Entities;

namespace WardOps.API.Database.Configurations;

public class WardTypeConfiguration : IEntityTypeConfiguration<WardType>
{
    public void Configure(EntityTypeBuilder<WardType> builder)
    {
        builder.HasKey(wt => wt.Id);

        builder.Property(wt => wt.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(wt => wt.Description)
            .HasMaxLength(500);
    }
}
