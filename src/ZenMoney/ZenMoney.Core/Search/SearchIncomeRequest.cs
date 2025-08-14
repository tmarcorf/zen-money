using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Enums;

namespace ZenMoney.Core.Search
{
    public class SearchIncomeRequest : BaseSearchRequest
    {
        public string? Description { get; set; }

        public IncomeTypeEnum? Type { get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }
    }
}
