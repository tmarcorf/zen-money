using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Enums;

namespace ZenMoney.Core.Search
{
    public class SearchExpenseRequest : BaseSearchRequest
    {
        public string? Description { get; set; }

        public ExpenseTypeEnum? Type { get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }
    }
}
