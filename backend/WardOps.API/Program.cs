using Carter;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Resend;
using Serilog;
using WardOps.API.Common;
using WardOps.API.Database;
using WardOps.API.Entities;
using WardOps.API.Extensions;
using WardOps.API.Services;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>();
}

builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .WriteTo.Console()
        .MinimumLevel.Information()
        .Enrich.FromLogContext();
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.ConfigureSwagger();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("wardops.db"));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

builder.Services.AddJwtAuthentication(builder.Configuration);

var emailConfig = builder.Configuration
    .GetSection(EmailConfig.SectionName)
    .Get<EmailConfig>();

builder.Services.Configure<EmailConfig>(builder.Configuration.GetSection(EmailConfig.SectionName));

builder.Services.AddOptions();
builder.Services.AddHttpClient<ResendClient>();
builder.Services.Configure<ResendClientOptions>(o =>
{
    o.ApiToken = emailConfig?.ApiKey ?? "";
});
builder.Services.AddTransient<IResend, ResendClient>();
builder.Services.AddTransient<IEmailService, ResendEmailService>();

var assembly = typeof(Program).Assembly;

builder.Services.AddMediatR(config =>
    config.RegisterServicesFromAssembly(assembly));

builder.Services.AddCarter();

builder.Services.AddValidatorsFromAssembly(assembly);

var app = builder.Build();

app.UseSerilogRequestLogging();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapCarter();

app.UseHttpsRedirection();

Log.Information("Starting WardOps API");
await DbInitializer.SeedData(app.Services);
Log.Information("Database seeded");

app.Run();
