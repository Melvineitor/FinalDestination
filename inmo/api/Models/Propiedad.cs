using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inmobilariaApi.Models
{
    public class Propiedad
    {
        [Key]
        public int id_propiedad { get; set; }
        public string titulo { get; set; } = "";
        public double m_ancho { get; set; }
        public double m_largo { get; set; }
        public double metros_cuadrados { get; set; }
        public string descripcion { get; set; } = "";
        public double? precio_venta { get; set; }
        public double? precio_alquiler { get; set; }
        [ForeignKey("Direccion")]
        public int direccion_propiedad { get; set; }
        public string estado_propiedad { get; set; } = ""; 
        [NotMapped]
        public Direccion Direccion { get; set; } = null!;
    }
}
