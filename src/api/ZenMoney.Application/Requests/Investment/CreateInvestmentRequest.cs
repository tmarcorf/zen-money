using System.Text.Json.Serialization;

namespace ZenMoney.Application.Requests.Investment
{
    public class CreateInvestmentRequest
    {
        public string Name { get; set; }

        public string Type { get; set; }

        public decimal InvestedAmount { get; set; }

        public decimal CurrentValue { get; set; }

        public DateOnly Date { get; set; }

        public string Notes { get; set; }

        [JsonIgnore]
        public Guid UserId { get; set; }
    }
}
