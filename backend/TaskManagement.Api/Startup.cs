using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TaskManagement.Api.Data;
using TaskManagement.Api.Extensions;
using TaskManagement.Api.Middleware;

namespace TaskManagement.Api
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddDatabase(Configuration);
            services.AddRepositories();
            services.AddApplicationServices();
            services.AddCorsPolicy();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, AppDbContext db)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            db.Database.EnsureCreated();

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AngularClient");
            app.UseMiddleware<BasicAuthMiddleware>();
            app.UseEndpoints(endpoints => endpoints.MapControllers());
        }
    }
}
