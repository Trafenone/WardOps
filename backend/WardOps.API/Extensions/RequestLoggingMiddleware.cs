namespace WardOps.API.Extensions;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        context.Request.EnableBuffering();

        var request = context.Request;
        if (request.Method == HttpMethods.Post || request.Method == HttpMethods.Put || request.Method == HttpMethods.Patch)
        {
            request.Body.Position = 0;
            using var reader = new StreamReader(request.Body, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            request.Body.Position = 0;

            _logger.LogInformation("HTTP {Method} {Path} Body: {Body}", request.Method, request.Path, body);
        }

        await _next(context);
    }
}
