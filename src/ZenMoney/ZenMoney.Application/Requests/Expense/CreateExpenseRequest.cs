using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.PaymentMethod;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Requests.Expense
{
    public class CreateExpenseRequest
    {
        public ExpenseTypeEnum Type { get; set; }

        public DateOnly Date { get; set; }

        public string Description { get; set; }

        public decimal Amount { get; set; }

        public bool IsPaid { get; set; }

        public Guid CategoryId { get; set; }

        public Guid PaymentMethodId { get; set; }

        [JsonIgnore]
        public Guid UserId { get; set; }
    }
}
