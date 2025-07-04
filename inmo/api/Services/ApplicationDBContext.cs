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
        public DbSet<PagoVista> PagoVista { get; set; } = null!;
        public DbSet<Fiador_Solidario> Fiador_Solidario { get; set; } = null!;
        public DbSet<Notario> Notarios { get; set; } = null!;
        public DbSet<Inmueble> Inmueble { get; set; } = null!;
        public DbSet<Direccion> Direccion { get; set; } = null!;
        public DbSet<Tarjeta> Tarjeta { get; set; } = null!;
        public DbSet<Venta> Venta { get; set; } = null!;
        public DbSet<Cita> Cita { get; set; } = null!;
        public DbSet<Transaccion> Transaccion { get; set; } = null!;
        public DbSet<Comision> Comision { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            try
            {
                // Set default schema for all tables
                modelBuilder.HasDefaultSchema("railway");

                // Configuración de la tabla Admin
                modelBuilder.Entity<Admin>(entity =>
                {
                    entity.ToTable("admin", "railway");
                    entity.HasKey(e => e.id_admin);
                    entity.Property(e => e.nombre_usuario).IsRequired();
                    entity.Property(e => e.contrasena).IsRequired();
                });

                // Configuración de la tabla Inmueble
                modelBuilder.Entity<Inmueble>(entity =>
                {
                    entity.ToTable("Inmueble", "railway");
                    entity.HasKey(e => e.id_inmueble);
                });

                // Configuración de la vista PagoVista
                modelBuilder.Entity<PagoVista>(entity =>
                {
                    entity.ToView("vista_pagos_detallado", "railway");
                    entity.HasKey(e => e.id_pago);
                });

                // Configure other entities to use the railway schema
                modelBuilder.Entity<Alquiler>().ToTable("alquiler", "railway");
                modelBuilder.Entity<Apartamento>().ToTable("apartamento", "railway");
                modelBuilder.Entity<Casa>().ToTable("casa", "railway");
                modelBuilder.Entity<Cita>().ToTable("cita", "railway");
                modelBuilder.Entity<Inquilino>().ToTable("inquilino", "railway");
                modelBuilder.Entity<Local>().ToTable("local", "railway");
                modelBuilder.Entity<Mantenimiento>().ToTable("mantenimiento", "railway");
                modelBuilder.Entity<Persona>().ToTable("persona", "railway");
                modelBuilder.Entity<Empleado>().ToTable("empleado", "railway");
                modelBuilder.Entity<Propiedad>().ToTable("propiedad", "railway");
                modelBuilder.Entity<Pago>().ToTable("pago", "railway");
                modelBuilder.Entity<Fiador_Solidario>().ToTable("fiador_solidario", "railway");
                modelBuilder.Entity<Notario>().ToTable("notario", "railway");
                modelBuilder.Entity<Direccion>().ToTable("direccion", "railway");
                modelBuilder.Entity<Tarjeta>().ToTable("tarjeta", "railway");
                modelBuilder.Entity<Venta>().ToTable("venta", "railway");
                modelBuilder.Entity<Cita>().ToTable("cita", "railway");
                modelBuilder.Entity<Inmueble>().ToTable("inmueble", "railway");
                modelBuilder.Entity<Transaccion>().ToTable("transaccion", "railway");
                modelBuilder.Entity<Comision>().ToTable("comision", "railway");
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