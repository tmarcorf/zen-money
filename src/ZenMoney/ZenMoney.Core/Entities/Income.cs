using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Enums;

namespace ZenMoney.Core.Entities
{
    public class Income : BaseEntity
    {
        [Required]
        public IncomeTypeEnum Type { get; set; }

        [Required]
        public DateOnly Date { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }

        [Required]
        public decimal Amount { get; set; }

        public Guid UserId { get; set; }

        public User User { get; set; }
    }
}
