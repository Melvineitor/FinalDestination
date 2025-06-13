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
        public int id_transaccion { get; set; }
        public int id_inmueble { get; set; }
        public string tipo_transaccion { get; set; } = "";
        public DateTime fecha_transaccion { get; set; }
        public double monto_transaccion { get; set; }
        public int? id_inquilino { get; set; }
        public string nombre_agente { get; set; } = "";
    }
}
