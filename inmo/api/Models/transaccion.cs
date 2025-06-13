using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    [Table("transaccion")]
    public class Transaccion
    {
        [Key]
        public int Id_Transaccion { get; set; }
        public int Id_Inmueble { get; set; }
        public string Tipo_Transaccion { get; set; } = "";
        public DateTime Fecha_Transaccion { get; set; }
        public double Monto_Transaccion { get; set; }
        public int? Id_Inquilino { get; set; }
        public string nombre_agente { get; set; } = "";

        [ForeignKey("Id_Inmueble")]
        public Inmueble Inmueble { get; set; } = null!;

        public Comision? Comision { get; set; } = null!;
    }
}
