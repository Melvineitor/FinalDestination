using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Apartamento
    {
        public int propiedad_apto { get; set; }
        [Key]
        public int id_apto { get; set; }
        public int nivel_apto { get; set; }
        public string plaza_apt { get; set; } = "";
        public int cant_bano_apt { get; set; }
        public int cant_habit_apt { get; set; }
        public int cant_parqueo_apt { get; set; }
        public cuarto_servicio_apt Estado { get; set; }
        public enum cuarto_servicio_apt
        {
            Si,
            No
        }
    }
}