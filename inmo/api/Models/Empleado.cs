using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Empleado
    {
        [Key]
        public int id_empleado { get; set; }
        [ForeignKey("Persona")]
        public int persona_empleado { get; set; }
        public double sueldo_empleado { get; set; }
        public int puesto_empleado { get; set; }

        public Persona Persona { get; set; } = null!;
    }
}