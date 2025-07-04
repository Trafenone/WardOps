namespace WardOps.API.Common.Configs;

public class JwtConfig
{
    public const string SectionName = "JwtConfig";
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpiryInMinutes { get; set; }
}