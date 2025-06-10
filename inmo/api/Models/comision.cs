

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inmobilariaApi.Models
{
   public class Comision
{
    [Key]
    public int Id_Comision { get; set; }

    [Required]
    public int Id_Transaccion { get; set; }

    [Required]
    public double Porcentaje_Comision { get; set; }

    [Required]
    public double Monto_Comision { get; set; }

    [ForeignKey("Id_Transaccion")]
    public Transaccion Transaccion { get; set; } = null!;
}
}