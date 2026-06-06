using ZenMoney.Application.Models.Investment;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Extensions
{
    public static class InvestmentExtensions
    {
        public static InvestmentModel ToModel(this Investment investment)
        {
            return new InvestmentModel
            {
                Id = investment.Id,
                CreatedAt = investment.CreatedAt,
                UpdatedAt = investment.UpdatedAt,
                Name = investment.Name,
                Type = investment.Type,
                InvestedAmount = investment.InvestedAmount,
                CurrentValue = investment.CurrentValue,
                Date = investment.Date,
                Notes = investment.Notes,
            };
        }

        public static List<InvestmentModel> ToModels(this IEnumerable<Investment> entities)
        {
            return entities
                .Select(x => x.ToModel())
                .ToList();
        }

        public static Investment ToEntity(this InvestmentModel investment)
        {
            return new Investment
            {
                Id = investment.Id,
                CreatedAt = investment.CreatedAt,
                UpdatedAt = investment.UpdatedAt,
                Name = investment.Name,
                Type = investment.Type,
                InvestedAmount = investment.InvestedAmount,
                CurrentValue = investment.CurrentValue,
                Date = investment.Date,
                Notes = investment.Notes,
            };
        }
    }
}
