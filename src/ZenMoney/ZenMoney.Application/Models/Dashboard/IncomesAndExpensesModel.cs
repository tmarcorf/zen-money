using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Application.Models.Dashboard
{
    public class IncomesAndExpensesModel
    {
        public int Month { get; set; }

        public int Year { get; set; }

        public decimal CurrentAmountIncomes { get; set; }

        public decimal CurrentAmountExpenses { get; internal set; }
    }
}
