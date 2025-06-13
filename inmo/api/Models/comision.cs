

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
    public int transaccion { get; set; }
    public string tipo_transaccion { get; set; } = "";
    public int id_inmueble { get; set; }
}
}