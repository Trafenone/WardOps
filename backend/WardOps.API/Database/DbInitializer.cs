using Microsoft.AspNetCore.Identity;
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
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        await EnsureRolesCreatedAsync(roleManager, logger);

        await CreateDefaultAdminIfNotExistsAsync(userManager, logger);
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
}