using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Dashboard;
using ZenMoney.Application.Results;
using ZenMoney.Core.Dashboard;

namespace ZenMoney.Application.Interfaces
{
    public interface IDashboardService
    {
        Task<Result<IncomesAndExpensesModel>> GetIncomesVersusExpensesByMonth(int month, int year);

        Task<Result<List<ExpensesByCategoryModel>>> GetExpensesByCategoryByMonth(int month, int year);

        Task<Result<List<ExpensesByPaymentMethodModel>>> GetExpensesByPaymentMethodByMonth(int month, int year);
    }
}
