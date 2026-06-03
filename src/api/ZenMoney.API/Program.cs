using System;
using Microsoft.EntityFrameworkCore;
using ZenMoney.Infrastructure.Data;
using ZenMoney.Infrastructure.IoC;

namespace ZenMoney.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var services = builder.Services;

            services.AddInfrastructure(builder.Configuration);
            services.AddInfrastructureJWT(builder.Configuration);
            services.AddInfrastructureSwagger();

            builder.Services.AddControllers();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // CORS: origins as a comma-separated string (easy to override via env var)
            var corsOrigins = builder.Configuration
                .GetValue<string>("Cors:Origins")
                ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                ?? new[] { "http://localhost:8080" };

            services.AddCors(options =>
            {
                options.AddPolicy("ZenMoneyApp",
                    policy =>
                    {
                        policy.WithOrigins(corsOrigins);
                        policy.AllowAnyMethod();
                        policy.AllowAnyHeader();
                        policy.AllowCredentials();
                    });
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                db.Database.Migrate();
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // HTTPS redirection can be disabled via configuration (useful in Docker/containers)
            if (!builder.Configuration.GetValue<bool>("NoHttpsRedirection"))
            {
                app.UseHttpsRedirection();
            }

            app.UseCors("ZenMoneyApp");
            app.UseAuthentication();
            app.UseAuthorization();

            // Health check endpoint for container orchestration
            app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

            app.MapControllers();

            app.Run();
        }
    }
}
