using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Income;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Extensions
{
    public static class IncomeExtensions
    {
        public static IncomeModel ToModel(this Income income)
        {
            return new IncomeModel
            {
                Id = income.Id,
                CreatedAt = income.CreatedAt,
                UpdatedAt = income.UpdatedAt,
                Type = income.Type,
                Date = income.Date,
                Description = income.Description,
                Amount = income.Amount,
            };
        }

        public static Income ToEntity(this IncomeModel income)
        {
            return new Income
            {
                Id = income.Id,
                CreatedAt = income.CreatedAt,
                UpdatedAt = income.UpdatedAt,
                Type = income.Type,
                Date = income.Date,
                Description = income.Description,
                Amount = income.Amount
            };
        }
    }
}
