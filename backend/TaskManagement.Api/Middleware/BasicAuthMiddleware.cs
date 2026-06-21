using System;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using TaskManagement.Api.Services;

namespace TaskManagement.Api.Middleware
{
    public class BasicAuthMiddleware
    {
        private readonly RequestDelegate _next;

        public BasicAuthMiddleware(RequestDelegate next) => _next = next;

        public async Task InvokeAsync(HttpContext context, IAuthService authService)
        {
            if (context.Request.Path.StartsWithSegments("/api/auth"))
            {
                await _next(context);
                return;
            }

            if (!context.Request.Headers.TryGetValue("Authorization", out var authHeader) ||
                !AuthenticationHeaderValue.TryParse(authHeader, out var parsed) ||
                !parsed.Scheme.Equals("Basic", StringComparison.OrdinalIgnoreCase) ||
                parsed.Parameter is null)
            {
                SetUnauthorized(context);
                return;
            }

            string credentials;
            try
            {
                credentials = Encoding.UTF8.GetString(Convert.FromBase64String(parsed.Parameter));
            }
            catch
            {
                SetUnauthorized(context);
                return;
            }

            var separatorIndex = credentials.IndexOf(':');
            if (separatorIndex < 0)
            {
                SetUnauthorized(context);
                return;
            }

            var username = credentials.Substring(0, separatorIndex);
            var password = credentials.Substring(separatorIndex + 1);

            if (!await authService.ValidateAsync(username, password))
            {
                SetUnauthorized(context);
                return;
            }

            context.Items["Username"] = username;
            await _next(context);
        }

        private static void SetUnauthorized(HttpContext context)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.Headers.Append("WWW-Authenticate", "Basic realm=\"TaskManagement\"");
        }
    }
}
