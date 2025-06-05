using api.Services;
using inmobilariaApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using System.Linq;

namespace inmo.api.Controllers
{
    [ApiController]
    [Route("api/forms")]
    [EnableCors]
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
        public IActionResult CrearPropiedad([FromBody] Inmueble nuevoInmueble)
        {
            if (nuevoInmueble == null)
            {
                return BadRequest("Datos incompletos");
            }

            _context.Inmueble.Add(nuevoInmueble);
            _context.SaveChanges();

            return Ok(nuevoInmueble); // puedes devolver solo el ID o todo el objeto
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

        [HttpPost("CrearDireccion")]
        public IActionResult CrearDireccion([FromBody] Direccion nuevaDireccion)
        {
            if (nuevaDireccion == null)
            {
                return BadRequest("Datos incompletos");
            }
            _context.Direccion.Add(nuevaDireccion);
            _context.SaveChanges();
            return Ok(nuevaDireccion);
        }
        [HttpPost("CrearTarjeta")]
        public IActionResult CrearTarjeta([FromBody] Tarjeta nuevaTarjeta)
        {
            if (nuevaTarjeta == null)
            {
                return BadRequest("Datos incompletos");
            }

            _context.Tarjeta.Add(nuevaTarjeta);
            _context.SaveChanges();

            return Ok(nuevaTarjeta);
        }
        [HttpPost("CrearVenta")]
        public IActionResult CrearVenta([FromBody] Venta nuevaVenta)
        {
            if (nuevaVenta == null)
            {
                return BadRequest("Datos incompletos");
            }

            _context.Venta.Add(nuevaVenta);
            _context.SaveChanges();

            return Ok(nuevaVenta);
        }
        [HttpPost("CrearCita")]
        public IActionResult CrearCita([FromBody] Cita nuevaCita)
        {
            if (nuevaCita == null)
            {
                return BadRequest("Datos incompletos");
            }

            _context.Cita.Add(nuevaCita);
            _context.SaveChanges();

            return Ok(nuevaCita);
        }
        
        

        [HttpGet("BuscarTarjetas")]
        public IActionResult BuscarTarjetas([FromQuery] string search)
        {
            if (string.IsNullOrWhiteSpace(search))
            {
                return BadRequest("El término de búsqueda es requerido");
            }

            var tarjetas = _context.Tarjeta
                .Where(t => 
                    t.id_tarjeta.ToString() == search || 
                    t.titular_tarjeta.Contains(search)
                )
                .Select(t => new {
                    t.id_tarjeta,
                    t.titular_tarjeta
                })
                .ToList();

            return Ok(tarjetas);
        }

        [HttpGet("ObtenerTarjeta/{id}")]
        public IActionResult ObtenerTarjeta(int id)
        {
            var tarjeta = _context.Tarjeta
                .Where(t => t.id_tarjeta == id)
                .Select(t => new {
                    t.id_tarjeta,
                    t.num_tarjeta,
                    t.tipo_tarjeta,
                    t.titular_tarjeta,
                    t.fecha_venc,
                    t.cvv,
                    t.compania_tarjeta
                })
                .FirstOrDefault();

            if (tarjeta == null)
            {
                return NotFound("Tarjeta no encontrada");
            }

            return Ok(tarjeta);
        }
    }
}
