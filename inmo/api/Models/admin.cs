using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    using System.ComponentModel.DataAnnotations;

    public class Admin
    {
        [Key]
        public int id_admin { get; set; }
        public string nombre_admin { get; set; } = "";
        public string apellido_admin { get; set; } = "";
        public string correo_admin { get; set; } = "";
        public string telefono_admin { get; set; } = "";
        public string cargo_admin { get; set; } = "";
        public string pais_admin { get; set; } = "";
        public string ciudad_admin { get; set; } = "";
        public string codigo_postal { get; set; } = "";
        public string nombre_usuario { get; set; } = "";
        public string contrasena { get; set; } = "";
    }
}