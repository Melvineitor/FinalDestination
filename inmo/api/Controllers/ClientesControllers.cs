using inmobilariaApi.Models;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace inmobilariaApi.Controllers
{
    [Route("api/Inmobilaria")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly ILogger<ClientesController> _logger;



        public ClientesController(ApplicationDBContext context, ILogger<ClientesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet("Clientes")]
        public async Task<ActionResult<int>> InquilinosInmo()
        {
            var result = await _context.Database.SqlQueryRaw<int>("SELECT COUNT(*) FROM inquilino").ToListAsync();
            return Ok(result.FirstOrDefault());
        }

        [HttpGet("Pagos")]
        public async Task<ActionResult<double>> PagosInmo()
        {
            var result = await _context.Database.SqlQueryRaw<double>("select sum(monto_pagado) as total_pagado_completo from pago where estado_pago = 'Completo';").ToListAsync();
            return Ok(result.FirstOrDefault());
        }

        public class EstadoPagoDto
        {
            public string estado { get; set; } = "";
            public int cantidad_registros { get; set; }
        }

        public class PagosMesDto
        {
            public string mes_corto { get; set; } = "";
            public double total { get; set; }
        }

        [HttpGet("PagosEstado")]
        public async Task<ActionResult<List<EstadoPagoDto>>> GetEstadosPagos()
        {
            var result = await _context.Database.SqlQueryRaw<EstadoPagoDto>(
                "select estado_pago as estado, count(*) as cantidad_registros from pago group by estado_pago"
            ).ToListAsync();

            return Ok(result);
        }

        [HttpGet("PagosMes")]
        public async Task<ActionResult<List<PagosMesDto>>> GetPagosMes()
        {
            var result = await _context.Database.SqlQueryRaw<PagosMesDto>(
                "select * from vista_barras"
            ).ToListAsync();

            return Ok(result);
        }

        [HttpGet("MostrarPersonas")]
        public async Task<ActionResult> MostrarPersonas()
        {
            var personas = new List<object>();
            var campoErrores = new List<string>();
            try
            {
                // Intentar mapeo normal
                var result = await _context.Database.SqlQueryRaw<Persona>(
                    "select id_persona, nombre_persona, apellido_persona, edad, telefono, cedula_pasaporte, sexo_persona, domicilio, contrasena, pais_origen, comentario, COALESCE(estado_civil, 0) as estado_civil, COALESCE(estado_persona, 0) as estado_persona from persona"
                ).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al mapear persona. Se intentará devolver todos los campos con diagnóstico de errores por registro.");
                // Consulta dinámica de todos los campos
                using (var conn = _context.Database.GetDbConnection())
                {
                    await conn.OpenAsync();
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = "select * from persona";
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            var fieldCount = reader.FieldCount;
                            while (await reader.ReadAsync())
                            {
                                var dict = new Dictionary<string, object?>();
                                var errores = new List<string>();
                                for (int i = 0; i < fieldCount; i++)
                                {
                                    var name = reader.GetName(i);
                                    try
                                    {
                                        dict[name] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                                    }
                                    catch (Exception e)
                                    {
                                        dict[name] = null;
                                        errores.Add(name);
                                        _logger.LogError(e, $"Falla al leer campo {name}");
                                    }
                                }
                                if (errores.Count > 0)
                                {
                                    dict["errores"] = errores;
                                }
                                personas.Add(dict);
                            }
                        }
                    }
                }
                return Ok(personas);
            }
        }

        [HttpGet("MostrarPropiedades")]
        public async Task<ActionResult> MostrarPropiedades()
        {
            var propiedades = new List<object>();
            try
            {
                var inmuebles = await _context.Inmueble.ToListAsync();
                var personas = await _context.Persona.ToListAsync();
                var direcciones = await _context.Direccion.ToListAsync();

                var result = inmuebles.Select(i => new {
                    i.id_inmueble,
                    propietario = personas.FirstOrDefault(p => p.id_persona == i.propietario_inmueble) != null
                        ? $"{personas.First(p => p.id_persona == i.propietario_inmueble).nombre_persona} {personas.First(p => p.id_persona == i.propietario_inmueble).apellido_persona}"
                        : "Sin propietario",
                    i.tipo_inmueble,
                    i.cant_niveles,
                    i.cant_habitaciones,
                    i.cant_banos,
                    i.cant_parqueos,
                    i.cuarto_servicio,
                    i.modulo_local,
                    i.plaza_local,
                    i.nivel_apt,
                    i.uso_espacio,
                    i.objetivo,
                    i.precio,
                    i.metros_ancho,
                    i.metros_largo,
                    direccion = direcciones.FirstOrDefault(d => d.id_direccion == i.direccion_inmueble) != null
                        ? $"{direcciones.First(d => d.id_direccion == i.direccion_inmueble).ciudad_direccion} - {direcciones.First(d => d.id_direccion == i.direccion_inmueble).zona} - {direcciones.First(d => d.id_direccion == i.direccion_inmueble).calle}"
                        : "Sin dirección",
                    i.estado_inmueble,
                    i.descripcion_detallada
                }).ToList();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al mapear propiedad. Se intentará devolver todos los campos con diagnóstico de errores por registro.");
                return Ok(propiedades);
            }
        }

        [HttpGet("MostrarAlquileres")]
        public async Task<ActionResult> MostrarAlquileres()
        {
            var alquileres = new List<object>();
            try
            {
                var result = await _context.Database.SqlQueryRaw<Alquiler>(
                    "select *, COALESCE(nombre_fiador, '') as nombre_fiador, COALESCE(nombre_notario, '') as nombre_notario from vista_alquileres_detallado;"
                ).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al mapear alquiler. Se intentará devolver todos los campos con diagnóstico de errores por registro.");
                // Consulta dinámica de todos los campos
                using (var conn = _context.Database.GetDbConnection())
                {
                    await conn.OpenAsync();
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = "select *, COALESCE(nombre_fiador, '') as nombre_fiador, COALESCE(nombre_notario, '') as nombre_notario from vista_alquileres_detallado;";
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            var fieldCount = reader.FieldCount;
                            while (await reader.ReadAsync())
                            {
                                var dict = new Dictionary<string, object?>();
                                var errores = new List<string>();
                                for (int i = 0; i < fieldCount; i++)
                                {
                                    var name = reader.GetName(i);
                                    try
                                    {
                                        dict[name] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                                    }
                                    catch (Exception e)
                                    {
                                        dict[name] = null;
                                        errores.Add(name);
                                        _logger.LogError(e, $"Falla al leer campo {name}");
                                    }
                                }
                                if (errores.Count > 0)
                                {
                                    dict["errores"] = errores;
                                }
                                alquileres.Add(dict);
                            }
                        }
                    }
                }
                return Ok(alquileres);
            }
        }
        [HttpGet("MostrarCitas")]
        public async Task<ActionResult> MostrarCitas()
        {
            var citas = new List<object>();
            try
            {
                var result = await _context.Database.SqlQueryRaw<Cita>(
                    "select * from vista_citas_detallado"
                ).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al mapear cita. Se intentará devolver todos los campos con diagnóstico de errores por registro.");
                return Ok(citas);
            }
        }
        [HttpGet("MostrarVentas")]
        public async Task<ActionResult> MostrarVentas()
        {
            var ventas = new List<object>();
            try
            {
                var result = await _context.Database.SqlQueryRaw<Venta>(
                    "select * from vista_ventas_detallado"
                ).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al mapear venta. Se intentará devolver todos los campos con diagnóstico de errores por registro.");
                return Ok(ventas);
            }
        }
        [HttpGet("MostrarPagos")]
        public async Task<ActionResult> MostrarPagos()
        {
            var pagos = new List<object>();
            try
            {
                var result = await _context.Database.SqlQueryRaw<PagoVista>(
                    "select * from vista_pagos_detallado"
                ).ToListAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al mapear pago. Se intentará devolver todos los campos con diagnóstico de errores por registro.");
                return Ok(pagos);
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Demo: usuario y contraseña hardcodeados
            var validUsers = new Dictionary<string, string>
            {
                { "test", "1234" },
                { "user2", "abcd" }
            };
            if (!validUsers.ContainsKey(request.Username) || validUsers[request.Username] != request.Password)
            {
                return Unauthorized("Usuario o contraseña incorrectos");
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, request.Username)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("SuperSecretKeyParaJWT123!"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: "inmoapi",
                audience: "inmoapi",
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );
            return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
        }

        public class LoginRequest
        {
            public string Username { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
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
    }
}