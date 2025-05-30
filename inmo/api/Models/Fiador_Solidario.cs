using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Fiador_Solidario
    {
        [Key]
        public int id_fiador_solidario { get; set; }
        [ForeignKey("Persona")]
        public int persona_fiador { get; set; }
        public Persona Persona { get; set; } = null!;
    }
}