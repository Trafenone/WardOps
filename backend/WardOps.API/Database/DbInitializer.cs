using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WardOps.API.Common;
using WardOps.API.Entities;
using WardOps.API.Entities.Enums;

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
        await SeedDepartmentsAsync(dbContext, logger);
        await SeedStaffAsync(userManager, dbContext, logger);
        await SeedPatientsAsync(dbContext, logger);
        await SeedWardsAndBedsAsync(dbContext, logger);
        await SeedHospitalizationsAsync(dbContext, logger);
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
                Position = PositionType.Administrator
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
                    Name = "Загальнотерапевтична",
                    Description = "Для пацієнтів із загальними захворюваннями"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Хірургічна",
                    Description = "Для післяопераційних пацієнтів або тих, хто очікує на операцію"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Інтенсивна терапія (ВІТ)",
                    Description = "Для критично хворих пацієнтів, що потребують інтенсивного моніторингу"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Педіатрична",
                    Description = "Для дітей та немовлят"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Ізолятор",
                    Description = "Для контролю інфекційних захворювань та ізоляції пацієнтів"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Реабілітаційна",
                    Description = "Для відновлення та реабілітації після важких хвороб або операцій"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Приватна",
                    Description = "Одномісні палати, що пропонують додаткову приватність та комфорт"
                },
                new WardType
                {
                    Id = Guid.NewGuid(),
                    Name = "Денний стаціонар",
                    Description = "Для короткочасних процедур, після яких пацієнтів виписують того ж дня"
                },
            };

            dbContext.WardTypes.AddRange(wardTypes);
            await dbContext.SaveChangesAsync();
        }
    }

    private static async Task SeedDepartmentsAsync(ApplicationDbContext dbContext, ILogger logger)
    {
        if (await dbContext.Departments.AnyAsync()) return;
        logger.LogInformation("Seeding departments");
        var departments = new List<Department>
        {
            new Department { Id = Guid.NewGuid(), Name = "Кардіологія" },
            new Department { Id = Guid.NewGuid(), Name = "Хірургія" },
            new Department { Id = Guid.NewGuid(), Name = "Терапія" },
            new Department { Id = Guid.NewGuid(), Name = "Неврологія" },
            new Department { Id = Guid.NewGuid(), Name = "Педіатрія" }
        };
        await dbContext.Departments.AddRangeAsync(departments);
        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedStaffAsync(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext,
        ILogger logger)
    {
        if (await userManager.Users.CountAsync() > 1) return;
        logger.LogInformation("Seeding staff");

        var departments = await dbContext.Departments.ToListAsync();
        var staffRole = Roles.Staff;

        var staffList = new List<(ApplicationUser user, string departmentName, string password)>
        {
            (new ApplicationUser { UserName = "olena.petrenko@wardops.com", Email = "olena.petrenko@wardops.com", EmailConfirmed = true, FirstName = "Олена", LastName = "Петренко", Position = PositionType.Doctor }, "Кардіологія", "Staff123!"),
            (new ApplicationUser { UserName = "ivan.franko@wardops.com", Email = "ivan.franko@wardops.com", EmailConfirmed = true, FirstName = "Іван", LastName = "Франко", Position = PositionType.Doctor }, "Хірургія", "Staff123!"),
            (new ApplicationUser { UserName = "mykhailo.kovalenko@wardops.com", Email = "mykhailo.kovalenko@wardops.com", EmailConfirmed = true, FirstName = "Михайло", LastName = "Коваленко", Position = PositionType.Doctor }, "Терапія", "Staff123!"),
            (new ApplicationUser { UserName = "hanna.shevchenko@wardops.com", Email = "hanna.shevchenko@wardops.com", EmailConfirmed = true, FirstName = "Ганна", LastName = "Шевченко", Position = PositionType.Nurse }, "Кардіологія", "Staff123!"),
            (new ApplicationUser { UserName = "serhiy.melnyk@wardops.com", Email = "serhiy.melnyk@wardops.com", EmailConfirmed = true, FirstName = "Сергій", LastName = "Мельник", Position = PositionType.Nurse }, "Хірургія", "Staff123!"),
            (new ApplicationUser { UserName = "kateryna.bondarenko@wardops.com", Email = "kateryna.bondarenko@wardops.com", EmailConfirmed = true, FirstName = "Катерина", LastName = "Бондаренко", Position = PositionType.Receptionist }, "Терапія", "Staff123!")
        };

        foreach (var staffItem in staffList)
        {
            var department = departments.FirstOrDefault(d => d.Name == staffItem.departmentName);
            if (department != null)
            {
                staffItem.user.DepartmentId = department.Id;
            }

            var result = await userManager.CreateAsync(staffItem.user, staffItem.password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(staffItem.user, staffRole);
            }
            else
            {
                logger.LogError("Failed to create staff user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
            }
        }
        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedPatientsAsync(ApplicationDbContext dbContext, ILogger logger)
    {
        if (await dbContext.Patients.AnyAsync()) return;
        logger.LogInformation("Seeding patients");

        var patients = new List<Patient>
        {
            new Patient { Id = Guid.NewGuid(), FirstName = "Василь", LastName = "Симоненко", Gender = Gender.Male, DateOfBirth = new DateTime(1965, 5, 20), PhoneNumber = "380951234567", MedicalCardNumber = "MC12345", AdmissionDiagnosis = "Гострий інфаркт міокарда", RequiresIsolation = false, Status = PatientStatus.Hospitalized, Notes = "Пацієнт потребує постійного моніторингу серцевого ритму." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Марія", LastName = "Примаченко", Gender = Gender.Female, DateOfBirth = new DateTime(1958, 8, 15), PhoneNumber = "380957654321", MedicalCardNumber = "MC54321", AdmissionDiagnosis = "Гіпертонічний криз", RequiresIsolation = false, Status = PatientStatus.Hospitalized, Notes = "Контроль артеріального тиску кожні 2 години." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Олександр", LastName = "Довженко", Gender = Gender.Male, DateOfBirth = new DateTime(1980, 1, 10), PhoneNumber = "380961112233", MedicalCardNumber = "MC67890", AdmissionDiagnosis = "Гострий апендицит", RequiresIsolation = false, Status = PatientStatus.Hospitalized, Notes = "Підготовка до апендектомії." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Леся", LastName = "Українка", Gender = Gender.Female, DateOfBirth = new DateTime(1992, 11, 30), PhoneNumber = "380973322111", MedicalCardNumber = "MC09876", AdmissionDiagnosis = "Закритий перелом стегнової кістки", RequiresIsolation = false, Status = PatientStatus.Hospitalized, Notes = "Післяопераційна реабілітація." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Григорій", LastName = "Сковорода", Gender = Gender.Male, DateOfBirth = new DateTime(1973, 3, 25), PhoneNumber = "380935556677", MedicalCardNumber = "MC13579", AdmissionDiagnosis = "Негоспітальна пневмонія", RequiresIsolation = true, Status = PatientStatus.Hospitalized, Notes = "Ізоляція через інфекційне захворювання." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Софія", LastName = "Яблонська", Gender = Gender.Female, DateOfBirth = new DateTime(1985, 7, 12), PhoneNumber = "380987766555", MedicalCardNumber = "MC97531", AdmissionDiagnosis = "Загострення бронхіальної астми", RequiresIsolation = false, Status = PatientStatus.Hospitalized, Notes = "Стан стабільний, продовжувати інгаляційну терапію." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Іван", LastName = "Франко", Gender = Gender.Male, DateOfBirth = new DateTime(1947, 4, 15), PhoneNumber = "380931112233", MedicalCardNumber = "MC24680", AdmissionDiagnosis = "Цукровий діабет II типу", RequiresIsolation = false, Status = PatientStatus.Registered, Notes = "Регулярний моніторинг рівня глюкози в крові." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Катерина", LastName = "Білокур", Gender = Gender.Female, DateOfBirth = new DateTime(1970, 9, 5), PhoneNumber = "380939988776", MedicalCardNumber = "MC11223", AdmissionDiagnosis = "Ішемічна хвороба серця", RequiresIsolation = false, Status = PatientStatus.Registered, Notes = "Призначено кардіообстеження." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Михайло", LastName = "Коцюбинський", Gender = Gender.Male, DateOfBirth = new DateTime(1999, 6, 3), PhoneNumber = "380938887766", MedicalCardNumber = "MC88776", AdmissionDiagnosis = "COVID-19", RequiresIsolation = true, Status = PatientStatus.Registered, Notes = "Ізоляція обов’язкова, моніторинг сатурації." },
            new Patient { Id = Guid.NewGuid(), FirstName = "Олена", LastName = "Теліга", Gender = Gender.Female, DateOfBirth = new DateTime(2002, 2, 14), PhoneNumber = "380939933221", MedicalCardNumber = "MC33221", AdmissionDiagnosis = "Гострий гастроентерит", RequiresIsolation = false, Status = PatientStatus.Registered, Notes = "Дієтичне харчування та регідратація." }
        };

        await dbContext.Patients.AddRangeAsync(patients);
        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedWardsAndBedsAsync(ApplicationDbContext dbContext, ILogger logger)
    {
        if (await dbContext.Wards.AnyAsync()) return;
        logger.LogInformation("Seeding wards and beds");

        var departments = await dbContext.Departments.ToDictionaryAsync(d => d.Name, d => d.Id);
        var wardTypes = await dbContext.WardTypes.ToDictionaryAsync(wt => wt.Name, wt => wt.Id);

        var wards = new List<Ward>
        {
            new Ward { Id = Guid.NewGuid(), WardNumber = "К-101", DepartmentId = departments["Кардіологія"], WardTypeId = wardTypes["Загальнотерапевтична"], GenderPolicy = WardGenderPolicy.Mixed, MaxCapacity = 4 },
            new Ward { Id = Guid.NewGuid(), WardNumber = "К-102", DepartmentId = departments["Кардіологія"], WardTypeId = wardTypes["Інтенсивна терапія (ВІТ)"], GenderPolicy = WardGenderPolicy.Mixed, MaxCapacity = 2 },
            new Ward { Id = Guid.NewGuid(), WardNumber = "Х-201", DepartmentId = departments["Хірургія"], WardTypeId = wardTypes["Хірургічна"], GenderPolicy = WardGenderPolicy.MaleOnly, MaxCapacity = 3 },
            new Ward { Id = Guid.NewGuid(), WardNumber = "Х-202", DepartmentId = departments["Хірургія"], WardTypeId = wardTypes["Хірургічна"], GenderPolicy = WardGenderPolicy.FemaleOnly, MaxCapacity = 3 },
            new Ward { Id = Guid.NewGuid(), WardNumber = "Т-301", DepartmentId = departments["Терапія"], WardTypeId = wardTypes["Загальнотерапевтична"], GenderPolicy = WardGenderPolicy.Mixed, MaxCapacity = 5 },
            new Ward { Id = Guid.NewGuid(), WardNumber = "Т-302", DepartmentId = departments["Терапія"], WardTypeId = wardTypes["Ізолятор"], GenderPolicy = WardGenderPolicy.Mixed, MaxCapacity = 1 }
        };

        foreach (var ward in wards)
        {
            var beds = new List<Bed>();
            for (int i = 1; i <= ward.MaxCapacity; i++)
            {
                beds.Add(new Bed { Id = Guid.NewGuid(), BedNumber = $"{ward.WardNumber}-{i}", Status = BedStatus.Available, WardId = ward.Id });
            }
            ward.Beds = beds;
        }

        await dbContext.Wards.AddRangeAsync(wards);
        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedHospitalizationsAsync(ApplicationDbContext dbContext, ILogger logger)
    {
        if (await dbContext.Hospitalizations.AnyAsync()) return;
        logger.LogInformation("Seeding hospitalizations");

        var patients = await dbContext.Patients.ToDictionaryAsync(p => p.LastName, p => p.Id);
        var availableBeds = await dbContext.Beds.Where(b => b.Status == BedStatus.Available).ToListAsync();

        var hospitalizations = new List<Hospitalization>();

        Bed? GetAndReserveAvailableBed(string wardNumberPrefix)
        {
            var bed = availableBeds.FirstOrDefault(b => b.BedNumber.StartsWith(wardNumberPrefix));
            if (bed != null)
            {
                availableBeds.Remove(bed);
                bed.Status = BedStatus.Occupied;
            }
            return bed;
        }

        var simonenkoBed = GetAndReserveAvailableBed("К-102");
        if (simonenkoBed != null)
        {
            hospitalizations.Add(new Hospitalization
            {
                Id = Guid.NewGuid(),
                PatientId = patients["Симоненко"],
                BedId = simonenkoBed.Id,
                AdmissionDateTime = DateTime.Now.AddDays(-2),
                AdmissionReason = "Гострий інфаркт міокарда",
                Status = HospitalizationStatus.Active
            });
        }

        var prymachenkoBed = GetAndReserveAvailableBed("К-101");
        if (prymachenkoBed != null)
        {
            hospitalizations.Add(new Hospitalization
            {
                Id = Guid.NewGuid(),
                PatientId = patients["Примаченко"],
                BedId = prymachenkoBed.Id,
                AdmissionDateTime = DateTime.Now.AddDays(-1),
                AdmissionReason = "Гіпертонічний криз",
                Status = HospitalizationStatus.Active
            });
        }

        var dovzhenkoBed = GetAndReserveAvailableBed("Х-201");
        if (dovzhenkoBed != null)
        {
            hospitalizations.Add(new Hospitalization
            {
                Id = Guid.NewGuid(),
                PatientId = patients["Довженко"],
                BedId = dovzhenkoBed.Id,
                AdmissionDateTime = DateTime.Now.AddHours(-12),
                AdmissionReason = "Гострий апендицит",
                Status = HospitalizationStatus.Active
            });
        }

        var ukrainkaBed = GetAndReserveAvailableBed("Х-202");
        if (ukrainkaBed != null)
        {
            hospitalizations.Add(new Hospitalization
            {
                Id = Guid.NewGuid(),
                PatientId = patients["Українка"],
                BedId = ukrainkaBed.Id,
                AdmissionDateTime = DateTime.Now.AddDays(-5),
                PlannedDischargeDateTime = DateTime.Now.AddDays(10),
                AdmissionReason = "Закритий перелом стегнової кістки",
                Status = HospitalizationStatus.Active
            });
        }

        var skovorodaBed = GetAndReserveAvailableBed("Т-302");
        if (skovorodaBed != null)
        {
            hospitalizations.Add(new Hospitalization
            {
                Id = Guid.NewGuid(),
                PatientId = patients["Сковорода"],
                BedId = skovorodaBed.Id,
                AdmissionDateTime = DateTime.Now.AddDays(-3),
                AdmissionReason = "Негоспітальна пневмонія",
                Status = HospitalizationStatus.Active
            });
        }

        var yablonskaBed = GetAndReserveAvailableBed("Т-301");
        if (yablonskaBed != null)
        {
            hospitalizations.Add(new Hospitalization
            {
                Id = Guid.NewGuid(),
                PatientId = patients["Яблонська"],
                BedId = yablonskaBed.Id,
                AdmissionDateTime = DateTime.Now.AddDays(-1),
                PlannedDischargeDateTime = DateTime.Now.AddDays(2),
                AdmissionReason = "Загострення бронхіальної астми",
                Status = HospitalizationStatus.Active
            });
        }

        if (hospitalizations.Any())
        {
            await dbContext.Hospitalizations.AddRangeAsync(hospitalizations);
            await dbContext.SaveChangesAsync();
        }
    }
}