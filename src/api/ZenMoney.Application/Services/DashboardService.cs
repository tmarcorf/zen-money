using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.Dashboard;
using ZenMoney.Application.Results;
using ZenMoney.Core.Dashboard;
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
                var error = ErrorHelper.GetInvalidParameterError($"{nameof(month)}/{nameof(year)}", $"{month}/{year}");

                return Result<IncomesAndExpensesModel>.Failure(error);
            }

            var userId = GetUserId();

            var totalAmountIncomes = await incomeRepository.GetTotalAmoutByMonth(month, year, userId);
            var totalAmountExpenses = await expenseRepository.GetTotalAmoutByMonth(month, year, userId);

            var incomesAndExpenses = new IncomesAndExpensesModel
            {
                Month = month,
                Year = year,
                CurrentAmountIncomes = totalAmountIncomes - totalAmountExpenses,
                CurrentAmountExpenses = totalAmountExpenses
            };

            return Result<IncomesAndExpensesModel>.Success(incomesAndExpenses);
        }

        public async Task<Result<List<ExpensesByCategoryModel>>> GetExpensesByCategoryByMonth(int month, int year)
        {
            if (!AreMonthAndYearValid(month, year))
            {
                var error = ErrorHelper.GetInvalidParameterError($"{nameof(month)}/{nameof(year)}", $"{month}/{year}");

                return Result<List<ExpensesByCategoryModel>>.Failure(error);
            }

            var userId = GetUserId();
            var expensesByCategoryByMonth = await expenseRepository.GetExpensesByCategoryByMonth(month, year, userId);

            return Result<List<ExpensesByCategoryModel>>.Success(expensesByCategoryByMonth);
        }

        public async Task<Result<List<ExpensesByPaymentMethodModel>>> GetExpensesByPaymentMethodByMonth(int month, int year)
        {
            if (!AreMonthAndYearValid(month, year))
            {
                var error = ErrorHelper.GetInvalidParameterError($"{nameof(month)}/{nameof(year)}", $"{month}/{year}");

                return Result<List<ExpensesByPaymentMethodModel>>.Failure(error);
            }

            var userId = GetUserId();
            var expensesByCategoryByMonth = await expenseRepository.GetExpensesByPaymentMethodByMonth(month, year, userId);

            return Result<List<ExpensesByPaymentMethodModel>>.Success(expensesByCategoryByMonth);
        }

        private bool AreMonthAndYearValid(int month, int year)
        {
            return month >= 1 && month <= 12 && year >= 1;
        }
    }
}
