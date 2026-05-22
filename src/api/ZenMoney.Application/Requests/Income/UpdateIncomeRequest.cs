using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Application.Requests.Income
{
    public class UpdateIncomeRequest : CreateIncomeRequest
    {
        public Guid Id { get; set; }
    }
}
