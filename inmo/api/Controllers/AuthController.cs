using Microsoft.AspNetCore.Mvc;
using inmobilariaApi.Models;
using System.Threading.Tasks;
using api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Cors;

namespace inmobilariaApi.Controllers
{
    [EnableCors("AllowSpecificOrigins")]
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ApplicationDBContext context, ILogger<AuthController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public class LoginRequest
        {
            [JsonPropertyName("nombre_usuario")]
            public string nombre_usuario { get; set; } = "";

            [JsonPropertyName("contrasena")]
            public string contrasena { get; set; } = "";
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                _logger.LogInformation($"Intento de login para usuario: {request.nombre_usuario}");

                if (string.IsNullOrEmpty(request.nombre_usuario) || string.IsNullOrEmpty(request.contrasena))
                {
                    return BadRequest("Usuario y contraseña son requeridos");
                }

                var usuario = await _context.Admin
                    .FirstOrDefaultAsync(a => a.nombre_usuario == request.nombre_usuario && a.contrasena == request.contrasena);

                if (usuario == null)
                {
                    _logger.LogWarning($"Intento de login fallido para usuario: {request.nombre_usuario}");
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

                _logger.LogInformation($"Login exitoso para usuario: {request.nombre_usuario}");
                return Ok(adminDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error en login para usuario: {request.nombre_usuario}");
                return StatusCode(500, "Error interno del servidor");
            }
        }

        [HttpPatch("update")]
        public async Task<IActionResult> UpdateAdmin([FromBody] Admin updatedAdmin)
        {
            try
            {
                var admin = await _context.Admin.FirstOrDefaultAsync(a => a.id_admin == updatedAdmin.id_admin);

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

                await _context.SaveChangesAsync();
                return Ok(admin);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al actualizar admin ID: {updatedAdmin.id_admin}");
                return StatusCode(500, "Error interno del servidor");
            }
        }
    }
}