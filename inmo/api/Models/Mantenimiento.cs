using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Mantenimiento
    {
        [Key]
        public int id_mantenimiento { get; set; }
        public DateOnly fecha_mantenimiento { get; set; }
        public double precio_mantenimiento { get; set; }
        public int apartamento_mantenimiento { get; set; }
        public TimeOnly hora_mantenimiento { get; set; }
        public estado_mantenimiento estado { get; set; }
        public enum estado_mantenimiento
        {
            Pendiente,
            Realizado,
            Cancelado
        }
        public string tipo_mantenimiento { get; set; } = null!;

    }
}