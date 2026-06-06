namespace ZenMoney.Core.Search
{
    public class SearchInvestmentRequest : BaseSearchRequest
    {
        public string? Name { get; set; }

        public string? Type { get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }
    }
}
