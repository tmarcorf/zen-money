using System.ComponentModel.DataAnnotations;

namespace ZenMoney.Core.Entities
{
    public class Investment : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string Type { get; set; }

        [Required]
        public decimal InvestedAmount { get; set; }

        [Required]
        public decimal CurrentValue { get; set; }

        [Required]
        public DateOnly Date { get; set; }

        [MaxLength(500)]
        public string Notes { get; set; }
    }
}
