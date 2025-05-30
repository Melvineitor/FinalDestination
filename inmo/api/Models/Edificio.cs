using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Edificio
    {
       
        public int propiedad_edif { get; set; }
        [Key]
        public int id_edificio { get; set; }
        public int cant_niveles_edif { get; set; }
        public int plazas_edif { get; set; }
        public int cant_parqueo_edif { get; set; }
    }
}