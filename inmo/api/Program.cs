using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

using api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddControllers();
builder.Services.AddHealthChecks();

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
});

// CORS configuration
var allowedOrigins = new[]
{
    "https://frontend-production-c40b.up.railway.app",
    "http://localhost:4200",
    "https://backend-production-7cbc.up.railway.app"
};

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("Authorization", "Content-Type")
            .SetPreflightMaxAge(TimeSpan.FromMinutes(10));
    });
});

// Database configuration
try
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    builder.Services.AddDbContext<ApplicationDBContext>(options =>
    {
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
               .LogTo(Console.WriteLine, LogLevel.Information)
               .EnableSensitiveDataLogging()
               .EnableDetailedErrors();
    });
}
catch (Exception ex)
{
    Console.WriteLine($"Error configuring database: {ex.Message}");
    throw;
}

var app = builder.Build();

// Verify database connection
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDBContext>();
        context.Database.OpenConnection();
        context.Database.CloseConnection();
        Console.WriteLine("Database connection verified successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error verifying database connection: {ex.Message}");
        throw;
    }
}

// CORS debe ser uno de los primeros middleware
app.UseCors();

// Configure the HTTP request pipeline.
// IMPORTANT: CORS must be called early in the pipeline, before Authorization and endpoints
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => "API is running");

app.MapHealthChecks("/health");

app.Run();


