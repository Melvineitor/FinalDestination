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
                _logger.LogInformation($"Iniciando proceso de login para usuario: {request.nombre_usuario}");

                if (request == null)
                {
                    _logger.LogWarning("Request body es nulo");
                    return BadRequest(new { message = "Request inválido" });
                }

                _logger.LogInformation($"Validando campos del request...");
                if (string.IsNullOrEmpty(request.nombre_usuario) || string.IsNullOrEmpty(request.contrasena))
                {
                    _logger.LogWarning("Campos requeridos faltantes");
                    return BadRequest(new { message = "Usuario y contraseña son requeridos" });
                }

                _logger.LogInformation($"Buscando usuario en la base de datos...");
                try
                {
                    var usuario = await _context.Admin
                        .AsNoTracking()
                        .FirstOrDefaultAsync(a => a.nombre_usuario == request.nombre_usuario);

                    if (usuario == null)
                    {
                        _logger.LogWarning($"Usuario no encontrado: {request.nombre_usuario}");
                        return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
                    }

                    if (usuario.contrasena != request.contrasena)
                    {
                        _logger.LogWarning($"Contraseña incorrecta para usuario: {request.nombre_usuario}");
                        return Unauthorized(new { message = "Usuario o contraseña incorrectos" });
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
                    return Ok(new { 
                        message = "Login exitoso",
                        data = adminDto
                    });
                }
                catch (Exception dbEx)
                {
                    _logger.LogError(dbEx, "Error al consultar la base de datos");
                    return StatusCode(500, new { message = "Error al acceder a la base de datos" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error no manejado en login para usuario: {request?.nombre_usuario}");
                return StatusCode(500, new { 
                    message = "Error interno del servidor",
                    details = ex.Message
                });
            }
        }

        [HttpPatch("update")]
        public async Task<IActionResult> UpdateAdmin([FromBody] Admin updatedAdmin)
        {
            try
            {
                if (updatedAdmin == null || updatedAdmin.id_admin <= 0)
                {
                    return BadRequest(new { message = "Datos de administrador inválidos" });
                }

                var admin = await _context.Admin.FirstOrDefaultAsync(a => a.id_admin == updatedAdmin.id_admin);

                if (admin == null)
                {
                    return NotFound(new { message = "Admin no encontrado" });
                }

                // Validar datos
                if (string.IsNullOrEmpty(updatedAdmin.nombre_admin) || 
                    string.IsNullOrEmpty(updatedAdmin.apellido_admin) ||
                    string.IsNullOrEmpty(updatedAdmin.correo_admin))
                {
                    return BadRequest(new { message = "Campos requeridos faltantes" });
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
                return Ok(new { 
                    message = "Administrador actualizado exitosamente",
                    data = admin 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error al actualizar admin ID: {updatedAdmin?.id_admin}");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}