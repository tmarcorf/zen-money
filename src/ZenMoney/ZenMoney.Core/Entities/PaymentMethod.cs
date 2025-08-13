using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Core.Entities
{
    public class PaymentMethod : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Description { get; set; }
    }
}
