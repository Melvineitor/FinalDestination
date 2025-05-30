using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Casa
    {
        public int propiedad_casa { get; set; }
        [Key]
        public int id_casa { get; set; }
        public int cantidad_niveles { get; set; }
        public int cant_habitacion_casa { get; set; }
        public int cant_bano_casa { get; set; }
        public int cant_parqueo_casa { get; set; }

        public cuarto_servicio_casa Estado { get; set; }
        public enum cuarto_servicio_casa
        {
            Si,
            No
        }
    }
}