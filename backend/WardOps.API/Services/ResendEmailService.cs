using Microsoft.Extensions.Options;
using Resend;
using WardOps.API.Common.Configs;

namespace WardOps.API.Services;

public class ResendEmailService : IEmailService
{
    private readonly IResend _resendClient;
    private readonly EmailConfig _emailConfig;
    private readonly ILogger<ResendEmailService> _logger;

    public ResendEmailService(IResend resendClient, IOptions<EmailConfig> emailConfig, ILogger<ResendEmailService> logger)
    {
        _resendClient = resendClient;
        _emailConfig = emailConfig.Value;
        _logger = logger;
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string htmlContent)
    {
        try
        {
            var email = new EmailMessage
            {
                From = $"{_emailConfig.FromName} <{_emailConfig.FromEmail}>",
                To = to,
                Subject = subject,
                HtmlBody = htmlContent
            };

            var response = await _resendClient.EmailSendAsync(email);

            if (!response.Success)
            {
                _logger.LogError("Failed to send email to {Email}", to);

                return false;
            }

            _logger.LogInformation("Email sent successfully to {Email}}", to);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending email to {Email}: {Message}", to, ex.Message);
            return false;
        }
    }

    public async Task<bool> SendWelcomeEmailAsync(string to, string firstName, string lastName, string position)
    {
        string subject = "Welcome to WardOps Management System";
        string htmlContent = $@"
        <html>
        <body>
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2 style='color: #4a6da7;'>Welcome to WardOps!</h2>
                <p>Hello {firstName} {lastName},</p>
                <p>Your account has been successfully created as <strong>{position}</strong> on the WardOps hospital management system.</p>
                <p>You can now log in to the system using your email address and the password provided to you by the administrator.</p>
                <p>If you have any questions, please contact your system administrator.</p>
                <p>Best regards,<br>The WardOps Team</p>
            </div>
        </body>
        </html>";

        return await SendEmailAsync(to, subject, htmlContent);
    }
}