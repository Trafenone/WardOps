using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Entities;

namespace WardOps.API.Database;

public static class DbInitializer
{
    public static async Task SeedData(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        await EnsureRolesCreatedAsync(roleManager, logger);
        await CreateDefaultAdminIfNotExistsAsync(userManager, logger);
        await CreateDefaultWardTypesIfNotExistsAsync(dbContext, logger);
    }

    private static async Task EnsureRolesCreatedAsync(RoleManager<IdentityRole> roleManager, ILogger logger)
    {
        string[] roleNames = { Roles.Admin, Roles.Staff };

        foreach (var roleName in roleNames)
        {
            var roleExists = await roleManager.RoleExistsAsync(roleName);
            if (!roleExists)
            {
                logger.LogInformation("Creating role: {RoleName}", roleName);
                var role = new IdentityRole(roleName);
                await roleManager.CreateAsync(role);
            }
        }
    }

    private static async Task CreateDefaultAdminIfNotExistsAsync(UserManager<ApplicationUser> userManager, ILogger logger)
    {
        var adminEmail = "admin@wardops.com";
        var admin = await userManager.FindByEmailAsync(adminEmail);

        if (admin == null)
        {
            logger.LogInformation("Creating default admin user");

            admin = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "System",
                LastName = "Administrator",
                Position = "Administrator"
            };

            var result = await userManager.CreateAsync(admin, "Admin123!");

            if (result.Succeeded)
            {
                logger.LogInformation("Admin user created successfully");
                await userManager.AddToRoleAsync(admin, Roles.Admin);
            }
            else
            {
                logger.LogError("Failed to create default admin user: {Errors}",
                    string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
    }

    private static async Task CreateDefaultWardTypesIfNotExistsAsync(ApplicationDbContext dbContext, ILogger logger)
    {
        var anyWardTypeExists = await dbContext.WardTypes.AnyAsync();

        if (!anyWardTypeExists)
        {
            logger.LogInformation("Creating default ward types");

            var wardTypes = new List<WardType>
            {
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "General Medical",
                    Description = "For patients with general medical conditions"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Surgical",
                    Description = "For post-operative patients or those awaiting surgery"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Intensive Care Unit (ICU)",
                    Description = "For critically ill patients requiring intensive monitoring"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Pediatric",
                    Description = "For children and infants"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Isolation",
                    Description = "For infectious disease control and isolation of patients"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Rehabilitation",
                    Description = "For recovery and rehabilitation after serious illness or surgery"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Private",
                    Description = "Single-bed rooms offering additional privacy and comfort"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Day Surgery",
                    Description = "For short-stay procedures where patients are discharged the same day"
                },
            };

            dbContext.WardTypes.AddRange(wardTypes);
            await dbContext.SaveChangesAsync();
        }
    }
}