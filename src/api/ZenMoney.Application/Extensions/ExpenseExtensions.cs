using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Models.Income;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Extensions
{
    public static class ExpenseExtensions
    {
        public static ExpenseModel ToModel(this Expense entity)
        {
            return new ExpenseModel
            {
                Id = entity.Id,
                Type = entity.Type,
                Date = entity.Date,
                Description = entity.Description,
                Amount = entity.Amount,
                IsPaid = entity.IsPaid,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt,
                CategoryId = entity.CategoryId,
                Category = entity.Category != null ? entity.Category.ToModel() : null,
                PaymentMethodId = entity.PaymentMethodId,
                PaymentMethod = entity.PaymentMethod != null ? entity.PaymentMethod.ToModel() : null
            };
        }

        public static List<ExpenseModel> ToModels(this IEnumerable<Expense> entities)
        {
            return entities
                .Select(x => x.ToModel())
                .ToList();
        }
    }
}
