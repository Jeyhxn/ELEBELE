using Microsoft.EntityFrameworkCore;
using SocialMediaForGamersApp.Data;
using SocialMediaForGamersApp.Repositories.Implementations;
using SocialMediaForGamersApp.Repositories.Interfaces;
using SocialMediaForGamersApp.Services;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JsonSerializerOptions>(options =>
{
    options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", corsBuilder =>
    {
        corsBuilder
            .WithOrigins(
                "http://localhost:5173", 
                "https://localhost:5173",
                "http://localhost:3000", 
                "https://localhost:3000"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddScoped<IRepository, Repository>();
builder.Services.AddScoped<IEmailService, EmailService>();

var app = builder.Build();

// Seed the database with sample data
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await DbInitializer.SeedAsync(dbContext);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
