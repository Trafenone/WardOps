namespace WardOps.API.Services;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string htmlContent);
    Task<bool> SendWelcomeEmailAsync(string to, string firstName, string lastName, string position);
}