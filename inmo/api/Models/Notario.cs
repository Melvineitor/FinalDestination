using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
namespace inmobilariaApi.Models
{
    public class Notario
    {
        [Key]
        public int id_notario { get; set; }
        public string matricula_colegio { get; set; } = null!;
        [ForeignKey("Persona")]
        public int persona_notario { get; set; }
        public Persona Persona { get; set; } = null!;
    }
}