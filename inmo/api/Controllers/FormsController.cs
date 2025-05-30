using api.Services;
using inmobilariaApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace inmo.api.Controllers
{
    [ApiController]
    [Route("api/forms")]
    public class FormsController : ControllerBase
    {
        // GET: api/forms
        public readonly ApplicationDBContext _context;
        public FormsController(ApplicationDBContext context)
        {
            _context = context;
        }


        [HttpPost("CrearPersona")]
        public IActionResult CrearPersona([FromBody] Persona nuevaPersona)
        {
            if (nuevaPersona == null)
            {
                return BadRequest("Datos incompletos");
            }

            _context.Persona.Add(nuevaPersona);
            _context.SaveChanges();

            return Ok(nuevaPersona); // puedes devolver solo el ID o todo el objeto
        }

        [HttpPost("CrearPropiedad")]
        public IActionResult CrearPropiedad([FromBody] Propiedad nuevaPropiedad)
        {
            if (nuevaPropiedad == null)
            {
                return BadRequest("Datos incompletos");
            }

            _context.Propiedad.Add(nuevaPropiedad);
            _context.SaveChanges();

            return Ok(nuevaPropiedad); // puedes devolver solo el ID o todo el objeto
        }

        [HttpPost("CrearPago")]
        public IActionResult CrearPago([FromBody] Pago nuevoPago)
        {
            if (nuevoPago == null)
            {
                return BadRequest("Datos incompletos");
            }

            _context.Pago.Add(nuevoPago);
            _context.SaveChanges();

            return Ok(nuevoPago); // puedes devolver solo el ID o todo el objeto
        }
        [HttpPost("CrearAlquiler")]
        public IActionResult CrearAlquiler([FromBody] Alquiler nuevoAlquiler)
        {
            if (nuevoAlquiler == null)
            {
                return BadRequest("Datos incompletos");
            }

            _context.alquiler.Add(nuevoAlquiler);
            _context.SaveChanges();

            return Ok(nuevoAlquiler); // puedes devolver solo el ID o todo el objeto
        }
    }
}
