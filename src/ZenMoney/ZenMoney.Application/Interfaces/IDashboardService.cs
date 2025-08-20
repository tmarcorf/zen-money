using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Dashboard;
using ZenMoney.Application.Results;

namespace ZenMoney.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<Result<IncomesAndExpensesModel>> GetIncomesAndExpensesAmountPerMonth(int month, int year);
    }
}
