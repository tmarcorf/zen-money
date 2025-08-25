using ZenMoney.Core.Entities;

namespace ZenMoney.Core.Dashboard
{
    public class ExpensesByCategoryModel
    {
        public int Month { get; set; }

        public int Year { get; set; }

        public Category Category { get; set; }

        public decimal TotalAmount { get; set; }
    }
}
