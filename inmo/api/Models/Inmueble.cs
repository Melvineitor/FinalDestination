using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    [Table("inmueble")]
    public class Inmueble
    {
        [Key]
        public int id_inmueble { get; set; }
        public int propietario_inmueble { get; set; }
        public string tipo_inmueble { get; set; } = ""; // "Casa", "Departamento", "Local Comercial", etc.

        public int? cant_niveles { get; set; }
        public int? cant_habitaciones { get; set; }
        public int? cant_banos { get; set; }
        public int? cant_parqueos { get; set; }
        public int? cuarto_servicio { get; set; } // 0 = No, 1 = Sí
        public string? modulo_local { get; set; } = "";
        public string? plaza_local { get; set; } = "";
        public int? nivel_apt { get; set; }
        public string objetivo { get; set; } = ""; // "Venta", "Alquiler", "Mantenimiento", etc.
        public double? precio { get; set; } // null si no está a la venta
        public string negociable { get; set; } = ""; // "Si", "No"
        public int? metros_ancho { get; set; }// "100 m²", "200 m²", etc.
        public int? metros_largo { get; set; } // "100 m²", "200 m²", etc.
        public int? area_total { get; set; } // "100 m²", "200 m²", etc.
        [ForeignKey("Direccion")]
        public int direccion_inmueble { get; set; }
        public string estado_inmueble { get; set; } = ""; // "Disponible", "Alquilado", "Vendido", etc.
        public string descripcion_detallada { get; set; } = "";
        public string codigo_referencia {get; set; } = "";


    }
}