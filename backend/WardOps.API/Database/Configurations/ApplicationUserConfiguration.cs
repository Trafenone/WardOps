﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WardOps.API.Entities;

namespace WardOps.API.Database.Configurations;

public class ApplicationUserConfiguration : IEntityTypeConfiguration<ApplicationUser>
{
    public void Configure(EntityTypeBuilder<ApplicationUser> builder)
    {
        builder.Property(u => u.FirstName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.LastName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(u => u.Position)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(100);

        builder.HasOne(u => u.Department)
            .WithMany(d => d.Users)
            .HasForeignKey(u => u.DepartmentId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(u => u.BedEventLogs)
            .WithOne(bel => bel.User)
            .HasForeignKey(bel => bel.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
