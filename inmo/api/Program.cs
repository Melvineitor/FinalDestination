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
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.SetIsOriginAllowed(origin => true) // Permite cualquier origen
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDBContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var app = builder.Build();

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


