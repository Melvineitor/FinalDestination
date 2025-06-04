using inmobilariaApi.Models;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

namespace api.Services
{
    public class ApplicationDBContext : DbContext
    {
        private readonly ILogger<ApplicationDBContext> _logger;

        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options, ILogger<ApplicationDBContext> logger) 
            : base(options)
        {
            _logger = logger;
        }

        public DbSet<Alquiler> alquiler { get; set; } = null!;
        public DbSet<Apartamento> apartamento { get; set; } = null!;
        public DbSet<Casa> casa { get; set; } = null!;
        public DbSet<Cita> cita { get; set; } = null!;
        public DbSet<Inquilino> Inquilino { get; set; } = null!;
        public DbSet<Local> local { get; set; } = null!;
        public DbSet<Mantenimiento> mantenimiento { get; set; } = null!;
        public DbSet<Admin> Admin { get; set; } = null!;
        public DbSet<Persona> Persona { get; set; } = null!;
        public DbSet<Empleado> Empleado { get; set; } = null!;
        public DbSet<Propiedad> Propiedad { get; set; } = null!;
        public DbSet<Pago> Pago { get; set; } = null!;
        public DbSet<Fiador_Solidario> Fiador_Solidario { get; set; } = null!;
        public DbSet<Notario> Notarios { get; set; } = null!;
        public DbSet<Inmueble> Inmueble { get; set; } = null!;
        public DbSet<Direccion> Direccion { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            try
            {
                // Configuración de la tabla Admin
                modelBuilder.Entity<Admin>(entity =>
                {
                    entity.ToTable("admin");
                    entity.HasKey(e => e.id_admin);
                    entity.Property(e => e.nombre_usuario).IsRequired();
                    entity.Property(e => e.contrasena).IsRequired();
                });

                _logger.LogInformation("Model configuration completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error configuring database model");
                throw;
            }
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return await base.SaveChangesAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving changes to database");
                throw;
            }
        }
    }
}