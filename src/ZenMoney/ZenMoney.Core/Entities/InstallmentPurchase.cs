using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Core.Entities
{
    public class InstallmentPurchase : BaseEntity
    {

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }

        [Required]
        public DateOnly Date { get; set; }

        [Required]
        public int NumberOfInstallments { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public Guid CategoryId { get; set; }

        public Category Category { get; set; }

        [Required]
        public Guid PaymentMethodId { get; set; }

        public PaymentMethod PaymentMethod { get; set; }
    }
}
