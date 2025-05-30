using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Inquilino
    {
        [Key]
        public int id_cliente { get; set; }
         [ForeignKey("Persona")]
        public int persona_cliente { get; set; }
        public string empleo_cliente { get; set; } = "";
        public string cargo_cliente { get; set; } = "";
        public double sueldo_cliente { get; set; }
        public string antiguo_arrendador_cliente { get; set; } = "";
        public Persona Persona { get; set; } = null!;

    }
}