using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Application.Requests.Category
{
    public class SearchCategoryRequest : BaseSearchRequest
    {
        public string Name { get; set; }

        public string SortField { get; set; }

        public string SortDirection { get; set; }
    }
}
