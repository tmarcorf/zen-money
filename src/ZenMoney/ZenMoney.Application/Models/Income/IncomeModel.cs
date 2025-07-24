using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Models.Income
{
    public record IncomeModel : BaseModel
    {
        public IncomeTypeEnum Type { get; set; }

        public DateOnly Date { get; set; }

        public string Description { get; set; }

        public decimal Amount { get; set; }
    }
}
