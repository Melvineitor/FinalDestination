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
        public string? plazo_pago { get; set; } = "";
        public int propiedad_venta { get; set; }
        public int? empleado_venta { get; set; }
        public int? inquilino_venta { get; set; }
        public int? notario_venta { get; set; }
        public string? contrato_venta { get; set; } = "";
        public string? estado_venta { get; set; } = "";
        public int? id_inmueble { get; set; }
    }
}
