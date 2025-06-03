using inmobilariaApi.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace api.Services
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        { }
        public DbSet<Alquiler> alquiler { get; set; } = null!;
        public DbSet<Apartamento> apartamento { get; set; } = null!;
        public DbSet<Casa> casa { get; set; } = null!;
        public DbSet<Cita> cita { get; set; } = null!;
        public DbSet<Inquilino> Inquilino { get; set; }
        public DbSet<Local> local { get; set; }
        public DbSet<Mantenimiento> mantenimiento { get; set; }
        public DbSet<Notario> notario { get; set; }
        public DbSet<Admin> Admin { get; set; }
        public DbSet<Persona> Persona { get; set; } = null!;
        public DbSet<Empleado> Empleado { get; set; } = null!;
        public DbSet<Propiedad> Propiedad { get; set; } = null!;
        public DbSet<Pago> Pago { get; set; } = null!;
        public DbSet<Fiador_Solidario> Fiador_Solidario { get; set; }
        public DbSet<Notario> Notarios { get; set; }
         public DbSet<Inmueble> Inmueble { get; set; } = null!;
        public DbSet<Direccion> Direccion { get; set; } = null!;
       



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure entity relationships and constraints here if needed
        }
    }
}