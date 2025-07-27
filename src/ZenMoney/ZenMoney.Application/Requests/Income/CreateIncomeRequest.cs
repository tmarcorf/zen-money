using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Requests.Income
{
    public class CreateIncomeRequest
    {
        public IncomeTypeEnum Type { get; set; }

        public DateOnly Date { get; set; }

        public string Description { get; set; }

        public decimal Amount { get; set; }
    }
}
