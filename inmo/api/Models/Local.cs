using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Local
    {
        [Key]
        public int propiedad_local { get; set; }
        public int id_local { get; set; }
        public string modulo { get; set; } = "";
        public string plaza { get; set; } = "";
        public int tipo_local { get; set; }
    }
}