namespace ZenMoney.Application.Requests.Investment
{
    public class UpdateInvestmentRequest : CreateInvestmentRequest
    {
        public Guid Id { get; set; }
    }
}
