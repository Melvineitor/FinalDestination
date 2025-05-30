

using System.ComponentModel.DataAnnotations;

namespace inmobilariaApi.Models
{
    public class Cita
    {
        [Key]
        public int id_cita { get; set; }
        public DateOnly fecha_cita { get; set; }
        public TimeOnly hora_cita { get; set; }
        public string motivo_cita { get; set; } = "";
        public string? nombre_empleado { get; set; } = "";
        public string? nombre_cliente { get; set; }= "";
        public string estado_cita { get; set; }= "";
      
    }
}