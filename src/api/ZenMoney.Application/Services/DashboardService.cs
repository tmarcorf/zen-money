using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Dashboard;
using ZenMoney.Application.Results;
using ZenMoney.Core.Dashboard;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Services
{
    public class DashboardService(
        IIncomeRepository incomeRepository,
        IExpenseRepository expenseRepository,
        IHttpContextAccessor httpContextAcessor) : BaseService(httpContextAcessor), IDashboardService
    {
        public async Task<Result<IncomesAndExpensesModel>> GetIncomesVersusExpensesByMonth(int month, int year)
        {
            if (!AreMonthAndYearValid(month, year))
            {
                return Result<IncomesAndExpensesModel>.Failure(ErrorCodes.InvalidMonthOrYear);
            }

            var userId = GetUserId();

            var totalAmountIncomes = await incomeRepository.GetTotalAmoutByMonth(month, year, userId);
            var totalAmountExpenses = await expenseRepository.GetTotalAmoutByMonth(month, year, userId);

            var incomesAndExpenses = new IncomesAndExpensesModel
            {
                Month = month,
                Year = year,
                CurrentAmountIncomes = totalAmountIncomes,
                CurrentAmountExpenses = totalAmountExpenses
            };

            return Result<IncomesAndExpensesModel>.Success(incomesAndExpenses);
        }

        public async Task<Result<List<ExpensesByCategoryModel>>> GetExpensesByCategoryByMonth(int month, int year)
        {
            if (!AreMonthAndYearValid(month, year))
            {
                return Result<List<ExpensesByCategoryModel>>.Failure(ErrorCodes.InvalidMonthOrYear);
            }

            var userId = GetUserId();
            var expensesByCategoryByMonth = await expenseRepository.GetExpensesByCategoryByMonth(month, year, userId);

            return Result<List<ExpensesByCategoryModel>>.Success(expensesByCategoryByMonth);
        }

        public async Task<Result<List<ExpensesByPaymentMethodModel>>> GetExpensesByPaymentMethodByMonth(int month, int year)
        {
            if (!AreMonthAndYearValid(month, year))
            {
                return Result<List<ExpensesByPaymentMethodModel>>.Failure(ErrorCodes.InvalidMonthOrYear);
            }

            var userId = GetUserId();
            var expensesByCategoryByMonth = await expenseRepository.GetExpensesByPaymentMethodByMonth(month, year, userId);

            return Result<List<ExpensesByPaymentMethodModel>>.Success(expensesByCategoryByMonth);
        }

        private static bool AreMonthAndYearValid(int month, int year)
        {
            return month >= 1 && month <= 12 && year >= 1;
        }
    }
}
