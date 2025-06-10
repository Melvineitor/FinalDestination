using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Alquiler
    {
        [Key]
        public int id_alquiler { get; set; }
        public DateOnly fecha_alquiler { get; set; }
        public DateOnly fecha_fin_alquiler { get; set; }
        public double pago_alquiler { get; set; }
        public string plazo_pago { get; set; } = "";
        public int propiedad_alquiler { get; set; }
        public int empleado_alquiler { get; set; }
        public int inquilino_alquiler { get; set; }
        public int? fiador_alquiler { get; set; }
        public int notario_alquiler { get; set; }
        public int contrato_alquiler { get; set; }
        public string estado_alquiler { get; set; } = "";
        public int id_inmueble { get; set; }

    }
}