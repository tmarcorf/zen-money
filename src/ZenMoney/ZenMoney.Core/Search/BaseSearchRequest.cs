using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Enums;

namespace ZenMoney.Core.Search
{
    public class BaseSearchRequest
    {
        public int Offset { get; set; }

        public int Take { get; set; }

        public SortFieldEnum? SortField { get; set; }

        public SortDirectionEnum? SortDirection { get; set; }
    }
}
