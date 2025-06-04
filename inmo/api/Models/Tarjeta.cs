using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Tarjeta
    {
        [Key]
        public int id_tarjeta { get; set; }

        public string num_tarjeta { get; set; } = "";
        
        public string tipo_tarjeta { get; set; } = "";
        public DateOnly fecha_venc { get; set; }
        public string titular_tarjeta { get; set; } = "";
        public int cvv { get; set; }
        public string compania_tarjeta { get; set; } = "";

    }
}