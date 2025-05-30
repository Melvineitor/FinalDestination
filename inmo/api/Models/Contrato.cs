using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace inmobilariaApi.Models
{
    public class Contrato
    {
        [Key]
        public int id_contrato { get; set; }
        public DateOnly inicio_contrato { get; set; }
        public DateOnly fin_contrato { get; set; }
        public estado_contrato Estado { get; set; }
        public enum estado_contrato
        {
            Cancelado,
            Vigente,
            Finalizado,
            Proceso
        }
        public string condiciones { get; set; } = "";
        public int tipo_contrato { get; set; }
    }
}
