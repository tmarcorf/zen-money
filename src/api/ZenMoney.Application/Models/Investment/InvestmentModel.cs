namespace ZenMoney.Application.Models.Investment
{
    public class InvestmentModel : BaseModel
    {
        public string Name { get; set; }

        public string Type { get; set; }

        public decimal InvestedAmount { get; set; }

        public decimal CurrentValue { get; set; }

        public DateOnly Date { get; set; }

        public string Notes { get; set; }
    }
}
