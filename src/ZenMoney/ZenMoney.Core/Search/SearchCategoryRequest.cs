using ZenMoney.Core.Enums;

namespace ZenMoney.Core.Search
{
    public class SearchCategoryRequest : BaseSearchRequest
    {
        public string? Name { get; set; }

        public SortFieldEnum? SortField { get; set; }

        public SortDirectionEnum? SortDirection { get; set; }
    }
}
