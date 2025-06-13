using System.ComponentModel.DataAnnotations;

namespace inmobilariaApi.Models
{
    public class Pago
    {
        [Key]
        public int id_pago { get; set; }
        public DateOnly fecha_pago {get; set;}
        public string  metodo_pago {get; set;} = "";
        public string motivo_pago {get; set;} = "";
        public string desc_pago {get; set;} = "";
        public int? tipo_contrato {get; set;}
        public int? descripcion_penalidad {get; set;}
        public int? compania_tarjeta {get; set;}
        public double monto_pagado {get; set;}
        public string estado_pago {get; set;} = "";
        public int? nombre_agente { get; set; }
    }
}