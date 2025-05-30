using Microsoft.AspNetCore.Mvc;
using inmobilariaApi.Models;
using System.Threading.Tasks;
using api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Net.Http.Json;
using System.Text.Json;

namespace inmobilariaApi.Controllers
{

    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public AuthController(ApplicationDBContext context)
        {
            _context = context;
        }

        public class LoginRequest
        {
            [JsonPropertyName("nombre_usuario")]
            public string nombre_usuario { get; set; } = "";

            [JsonPropertyName("contrasena")]
            public string contrasena { get; set; } = "";
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var usuario = _context.Admin
                .FirstOrDefault(a => a.nombre_usuario == request.nombre_usuario && a.contrasena == request.contrasena);

            if (usuario == null)
            {
                return Unauthorized("Usuario o contraseña incorrectos");
            }

            var adminDto = new
            {
                usuario.id_admin,
                usuario.nombre_admin,
                usuario.apellido_admin,
                usuario.cargo_admin,
                usuario.ciudad_admin,
                usuario.codigo_postal,
                usuario.correo_admin,
                usuario.pais_admin,
                usuario.telefono_admin,
                usuario.nombre_usuario
            };
            Console.WriteLine(JsonSerializer.Serialize(adminDto));
            return Ok(adminDto);
        }
        [HttpPatch("update")]
        public IActionResult UpdateAdmin([FromBody] Admin updatedAdmin)
        {
            var admin = _context.Admin.FirstOrDefault(a => a.id_admin == updatedAdmin.id_admin);

            if (admin == null)
            {
                return NotFound("Admin no encontrado");
            }

            admin.nombre_admin = updatedAdmin.nombre_admin;
            admin.apellido_admin = updatedAdmin.apellido_admin;
            admin.cargo_admin = updatedAdmin.cargo_admin;
            admin.ciudad_admin = updatedAdmin.ciudad_admin;
            admin.codigo_postal = updatedAdmin.codigo_postal;
            admin.correo_admin = updatedAdmin.correo_admin;
            admin.pais_admin = updatedAdmin.pais_admin;
            admin.telefono_admin = updatedAdmin.telefono_admin;
            admin.nombre_usuario = updatedAdmin.nombre_usuario;
            

            _context.SaveChanges();

            return Ok(admin);
        }
    }
}