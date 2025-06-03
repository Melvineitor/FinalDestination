using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace inmobilariaApi.Models
{
    public class Persona
    {
        [Key]
        public int id_persona { get; set; }
        public string nombre_persona { get; set; } = "";


        public string apellido_persona { get; set; } = "";
        public string rol_persona { get; set; } = "";
        public int edad { get; set; }

        public string telefono { get; set; } = "";

        public string correo_persona { get; set; } = "";

        public string cedula_pasaporte { get; set; } = "";

        public string sexo_persona { get; set; } = ""; // "Masculino", "Femenino", "Otro"



        public string estado_civil { get; set; } = "";
        public string domicilio { get; set; } = "";
        public string contrasena { get; set; } = "";
        public string estado_persona { get; set; } = ""; // "Activo", "Inactivo", "Eliminado"


        public string pais_origen { get; set; } = "";
        public string numero_cuenta_banco { get; set; } = "";
        public string? tipo_cuenta_banco { get; set; } = ""; // "Ahorros", "Corriente", etc.
        public string banco { get; set; } = "";
        public string comentario { get; set; } = "";
    }
}