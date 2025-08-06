using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.PaymentMethod;
using ZenMoney.Application.Models.User;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Models.Expense
{
    public class ExpenseModel : BaseModel
    {
        public ExpenseTypeEnum Type { get; set; }

        public DateOnly Date { get; set; }

        public string Description { get; set; }

        public decimal Amount { get; set; }

        public bool IsPaid { get; set; }

        public Guid CategoryId { get; set; }

        public CategoryModel Category { get; set; }

        public Guid PaymentMethodId { get; set; }

        public PaymentMethodModel PaymentMethod { get; set; }
    }
}
