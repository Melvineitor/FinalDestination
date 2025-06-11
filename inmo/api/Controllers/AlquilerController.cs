using api.Services;
using inmobilariaApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace inmo.api.Controllers
{
    [Route("api/alquiler")]
    [ApiController]
    public class DepartamentosController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public DepartamentosController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet("inmuebles")]
        public async Task<IActionResult> GetInmuebles()
        {
            var propiedades = await (from i in _context.Inmueble
                                     where i.estado_inmueble == "Disponible" || i.estado_inmueble == "Mantenimiento"
                                     select new
                                     {
                                         id_inmueble = i.id_inmueble,
                                         precio = i.precio,
                                         codigo_referencia = i.codigo_referencia
                                     }).ToListAsync();

            return Ok(propiedades);
        }

        [HttpGet("empleados")]
        public async Task<IActionResult> GetEmpleados()
        {
            var empleados = await _context.Empleado
                .Include(e => e.Persona)
                .Select(e => new
                {
                    e.id_empleado,
                    NombreCompleto = e.Persona.nombre_persona + " " + e.Persona.apellido_persona
                })
                .ToListAsync();

            return Ok(empleados);
        }

        [HttpGet("inquilinos")]
        public async Task<IActionResult> GetInquilinos()
        {
            var inquilinos = await _context.Inquilino
                .Include(i => i.Persona)
                .ToListAsync();

            var inmuebles = await _context.Inmueble.ToListAsync();
            var direcciones = await _context.Direccion.ToListAsync();

            var resultado = inquilinos.Select(i => new
            {
                i.id_cliente,
                NombreCompleto = i.Persona.nombre_persona + " " + i.Persona.apellido_persona,
                Inmuebles = inmuebles
                    .Where(im => im.propietario_inmueble.ToString() == i.id_cliente.ToString())
                    .Select(im => new
                    {
                        im.id_inmueble,
                        Direccion = direcciones.FirstOrDefault(d => d.id_direccion == im.direccion_inmueble) != null
                            ? $"{direcciones.First(d => d.id_direccion == im.direccion_inmueble).ciudad_direccion} - {direcciones.First(d => d.id_direccion == im.direccion_inmueble).zona} - {direcciones.First(d => d.id_direccion == im.direccion_inmueble).calle}"
                            : "Sin dirección"
                    }).ToList()
            }).ToList();

            return Ok(resultado);
        }

        [HttpGet("fiadores")]
        public async Task<IActionResult> GetFiadores()
        {
            var fiadores = await _context.Fiador_Solidario
                .Include(f => f.Persona)
                .Select(f => new
                {
                    f.id_fiador_solidario,
                    NombreCompleto = f.Persona.nombre_persona + " " + f.Persona.apellido_persona
                })
                .ToListAsync();
            return Ok(fiadores);
        }

        [HttpGet("notarios")]
        public async Task<IActionResult> GetNotarios()
        {
            var notarios = await _context.Notarios
                .Include(n => n.Persona)
                .Select(n => new
                {
                    n.id_notario,
                    NombreCompleto = n.Persona.nombre_persona + " " + n.Persona.apellido_persona
                })
                .ToListAsync();
            return Ok(notarios);
        }

    }
}


