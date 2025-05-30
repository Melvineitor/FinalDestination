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

        [HttpGet("propiedades")]
        public async Task<IActionResult> GetPropiedades()
        {
            var propiedades = await (from p in _context.Propiedad
                                     join d in _context.Direccion
                                     on p.direccion_propiedad equals d.id_direccion
                                     where p.estado_propiedad == "Disponible"
                                     select new
                                     {
                                         id_propiedad = p.id_propiedad,
                                         direccion = $"{d.ciudad_direccion} - {d.zona} - {d.calle}"
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
                .Select(i => new
                {
                    i.id_cliente,
                    NombreCompleto = i.Persona.nombre_persona + " " + i.Persona.apellido_persona
                })
                .ToListAsync();

            return Ok(inquilinos);
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


