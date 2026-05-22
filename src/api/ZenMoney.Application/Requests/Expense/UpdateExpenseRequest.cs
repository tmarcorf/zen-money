using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Application.Requests.Expense
{
    public class UpdateExpenseRequest : CreateExpenseRequest
    {
        public Guid Id { get; set; }
    }
}
