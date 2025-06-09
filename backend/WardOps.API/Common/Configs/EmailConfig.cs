namespace WardOps.API.Common.Configs;

public class EmailConfig
{
    public const string SectionName = "EmailConfig";
    public string ApiKey { get; set; } = string.Empty;
    public string FromEmail { get; set; } = string.Empty;
    public string FromName { get; set; } = string.Empty;
}