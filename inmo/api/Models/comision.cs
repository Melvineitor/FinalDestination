

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inmobilariaApi.Models
{
   public class Comision
{
    [Key]
    public int id_comision { get; set; }
    public double porcentaje_comision { get; set; }
    public double monto_comision { get; set; }
    public DateOnly fecha_comision { get; set; }
    public string estado_comision { get; set; } = "";
    public int id_transaccion { get; set; }

    [ForeignKey("id_transaccion")]
    public Transaccion transaccion { get; set; } = null!;
    public string tipo_transaccion { get; set; } = "";

    [ForeignKey("id_inmueble")]
    public Inmueble inmueble { get; set; } = null!;
}
}