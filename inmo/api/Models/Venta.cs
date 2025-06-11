using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inmobilariaApi.Models
{
    public class Venta
    {
        [Key]
        public int id_venta { get; set; }
        public DateOnly fecha_venta { get; set; }
        public double pago_venta { get; set; }
        public int id_inmueble { get; set; }
        public string nombre_empleado { get; set; } = "";
        public string? nombre_cliente { get; set; } = "";
        public string? nombre_fiador { get; set; } = "";
        public string? nombre_notario { get; set; } = "";
        public string? contrato_venta { get; set; } = "";
        public string? estado_venta { get; set; } = "";
    }
}
