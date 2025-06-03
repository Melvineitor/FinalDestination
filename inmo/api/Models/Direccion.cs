using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Direccion
    {
        [Key]
        public int id_direccion { get; set; }
        public string ciudad_direccion { get; set; } = "";
        public string zona { get; set; } = "";
        public string calle { get; set; } = "";
        public string especificaciones_direccion { get; set; } = "";
        public string provincia { get; set; } = "";
    }

}