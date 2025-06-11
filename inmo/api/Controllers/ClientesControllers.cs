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
            var result = await _context.Database.SqlQueryRaw<int>("SELECT COUNT(*) FROM persona WHERE rol_persona = 'Inquilino' or rol_persona = 'Propietario';").ToListAsync();
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
                // Intentar mapeo normal con SqlQueryRaw
                var result = await _context.Database.SqlQueryRaw<Inmueble>(
                    "SELECT id_inmueble, propietario_inmueble, tipo_inmueble, cant_niveles, cant_habitaciones, " +
                    "cant_banos, cant_parqueos, cuarto_servicio, modulo_local, plaza_local, nivel_apt, " +
                    "uso_espacio, objetivo, precio, negociable,metros_ancho, metros_largo, direccion_inmueble, " +
                    "estado_inmueble, descripcion_detallada, codigo_referencia FROM inmueble"
                ).ToListAsync();

                // Obtener datos relacionados
                var personas = await _context.Persona.ToListAsync();
                var direcciones = await _context.Direccion.ToListAsync();

                // Mapear el resultado con los datos relacionados
                var mappedResult = result.Select(i => new {
                    i.id_inmueble,
                    propietario = personas.FirstOrDefault(p => p.id_persona.ToString() == i.propietario_inmueble.ToString()) != null
                        ? $"{personas.First(p => p.id_persona.ToString() == i.propietario_inmueble.ToString()).nombre_persona} {personas.First(p => p.id_persona.ToString() == i.propietario_inmueble.ToString()).apellido_persona}"
                        : "Sin propietario",
                    tipo_inmueble = i.tipo_inmueble ?? "-",
                    cant_niveles = i.cant_niveles ?? 0,
                    cant_habitaciones = i.cant_habitaciones ?? 0,
                    cant_banos = i.cant_banos ?? 0,
                    cant_parqueos = i.cant_parqueos ?? 0,
                    cuarto_servicio = i.cuarto_servicio ?? 0,
                    modulo_local = i.modulo_local ?? "-",
                    plaza_local = i.plaza_local ?? "-",
                    nivel_apt = i.nivel_apt ?? 0,
                    uso_espacio = i.uso_espacio ?? "-",
                    objetivo = i.objetivo ?? "-",
                    precio = i.precio ?? 0.0,
                    negociable = i.negociable ?? "-",
                    metros_ancho = i.metros_ancho ?? 0,
                    metros_largo = i.metros_largo ?? 0,
                    direccion = direcciones.FirstOrDefault(d => d.id_direccion.ToString() == i.direccion_inmueble.ToString()) != null
                        ? $"{direcciones.First(d => d.id_direccion.ToString() == i.direccion_inmueble.ToString()).ciudad_direccion} - {direcciones.First(d => d.id_direccion.ToString() == i.direccion_inmueble.ToString()).zona} - {direcciones.First(d => d.id_direccion.ToString() == i.direccion_inmueble.ToString()).calle}"
                        : "",
                    estado_inmueble = i.estado_inmueble ?? "",
                    descripcion_detallada = i.descripcion_detallada ?? "",
                    codigo_referencia = i.codigo_referencia ?? ""
                }).ToList();

                return Ok(mappedResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al mapear propiedad. Se intentará devolver todos los campos con diagnóstico de errores por registro.");
                // Consulta dinámica de todos los campos
                using (var conn = _context.Database.GetDbConnection())
                {
                    await conn.OpenAsync();
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = "SELECT * FROM inmueble";
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            var fieldCount = reader.FieldCount;
                            while (await reader.ReadAsync())
                            {
                                var registro = new Dictionary<string, object>();
                                for (int i = 0; i < fieldCount; i++)
                                {
                                    var columnName = reader.GetName(i);
                                    var value = reader.IsDBNull(i) ? DBNull.Value : reader.GetValue(i);
                                    registro[columnName] = value;
                                }
                                propiedades.Add(registro);
                            }
                        }
                    }
                }
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
            try
            {
                _logger.LogInformation("Iniciando consulta de vista_pagos_detallado");
                
                // Primero intentamos obtener los datos usando Entity Framework
                var result = await _context.PagoVista.ToListAsync();
                if (result != null && result.Any())
                {
                    _logger.LogInformation($"Se encontraron {result.Count} registros en vista_pagos_detallado");
                    return Ok(result);
                }

                // Si no hay resultados con EF, intentamos con SQL directo
                _logger.LogInformation("Intentando consulta SQL directa");
                var pagos = new List<object>();
                using (var conn = _context.Database.GetDbConnection())
                {
                    await conn.OpenAsync();
                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = "SELECT * FROM railway.vista_pagos_detallado";
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            var fieldCount = reader.FieldCount;
                            while (await reader.ReadAsync())
                            {
                                var dict = new Dictionary<string, object?>();
                                for (int i = 0; i < fieldCount; i++)
                                {
                                    var name = reader.GetName(i);
                                    dict[name] = reader.IsDBNull(i) ? null : reader.GetValue(i);
                                }
                                pagos.Add(dict);
                            }
                        }
                    }
                }

                if (pagos.Any())
                {
                    _logger.LogInformation($"Se encontraron {pagos.Count} registros usando SQL directo");
                    return Ok(pagos);
                }

                _logger.LogWarning("No se encontraron registros en vista_pagos_detallado");
                return Ok(new List<object>()); // Retornamos lista vacía en lugar de null
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al consultar vista_pagos_detallado");
                return StatusCode(500, new { message = "Error al consultar los pagos", error = ex.Message });
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