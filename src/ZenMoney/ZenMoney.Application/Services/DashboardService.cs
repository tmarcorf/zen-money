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
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Services
{
    public class DashboardService(
        IIncomeRepository incomeRepository,
        IExpenseRepository expenseRepository,
        IHttpContextAccessor httpContextAcessor) : BaseService(httpContextAcessor), IDashboardService
    {
        public async Task<Result<IncomesAndExpensesModel>> GetIncomesAndExpensesAmountPerMonth(int month, int year)
        {
            if (!AreMonthAndYearValid(month, year))
            {
                var error = ErrorHelper.GetInvalidParameterError($"{nameof(month)}/{nameof(year)}", $"{month}/{year}");

                return Result<IncomesAndExpensesModel>.Failure(error);
            }

            var userId = GetUserId();

            var totalAmountIncomes = await incomeRepository.GetTotalAmoutPerMonth(month, year, userId);
            var totalAmountExpenses = await expenseRepository.GetTotalAmoutPerMonth(month, year, userId);

            var incomesAndExpenses = new IncomesAndExpensesModel
            {
                Month = month,
                Year = year,
                TotalAmountIncomes = totalAmountIncomes,
                TotalAmountExpenses = totalAmountExpenses
            };

            return Result<IncomesAndExpensesModel>.Success(incomesAndExpenses);
        }

        private bool AreMonthAndYearValid(int month, int year)
        {
            return month >= 1 && month <= 12 && year >= 1;
        }
    }
}
