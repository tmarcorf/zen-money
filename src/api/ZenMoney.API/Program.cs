
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
            services.AddCors(options =>
            {
                options.AddPolicy("ZenMoneyApp",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:8080");
                        policy.AllowAnyMethod();
                        policy.AllowAnyHeader();
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

            app.UseCors("ZenMoneyApp");
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
