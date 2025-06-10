using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;

namespace api.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    [EnableCors]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public DashboardController(ApplicationDBContext context)
        {
            _context = context;
        }

       [HttpGet("TotalComisiones")]
    public async Task<ActionResult<double>> GetTotalComisiones()
    {
        var total = await _context.Comision.SumAsync(c => c.Monto_Comision);
        return Ok(total);
    }
public class GananciaMensualDto
{
    public int Mes { get; set; }
        public int Anio { get; set; }
    public double TotalGanancia { get; set; }
}

    // GET: api/Comisiones/GananciasPorMes
   [HttpGet("GananciasPorMes")]
public async Task<ActionResult<IEnumerable<GananciaMensualDto>>> ObtenerGananciasMensuales()
{
    var resultadosSql = new Dictionary<int, double>();

    using (var connection = _context.Database.GetDbConnection())
    {
        await connection.OpenAsync();
        using (var command = connection.CreateCommand())
        {
            command.CommandText = @"
                SELECT 
                    MONTH(fecha_transaccion) AS Mes,
                    COALESCE(SUM(monto_transaccion), 0) AS TotalGanancia
                FROM vista_transacciones_detallado
                GROUP BY MONTH(fecha_transaccion)
                ORDER BY Mes";

            using (var reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    int mes = reader.GetInt32(0);
                    double total = reader.GetDouble(1); // Ya usamos COALESCE en SQL
                    resultadosSql[mes] = total;
                    Console.WriteLine($"Mes: {mes}, Total: {total}"); // Debug log
                }
            }
        }
    }

    // Rellenar los 12 meses con los datos obtenidos (o 0 si faltan)
    var lista = Enumerable.Range(1, 12)
        .Select(mes => new GananciaMensualDto
        {
            Mes = mes,
            Anio = DateTime.Now.Year,
            TotalGanancia = resultadosSql.ContainsKey(mes) ? resultadosSql[mes] : 0
        })
        .ToList();

    // Debug log
    foreach (var item in lista)
    {
        Console.WriteLine($"Final - Mes: {item.Mes}, Total: {item.TotalGanancia}");
    }

    return Ok(lista);
}



}
}
