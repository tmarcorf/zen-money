using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Dashboard;
using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Services;
using ZenMoney.Core.Dashboard;

namespace ZenMoney.API.Controllers
{
    [Route("api/dashboards")]
    [ApiController]
    public class DashboardController(
        IDashboardService dashboardService) : ControllerBase
    {
        [Authorize]
        [HttpGet("incomes-expenses")]
        public async Task<IActionResult> GetIncomesAndExpensesAmountPerMonth(int month, int year)
        {
            var result = await dashboardService.GetIncomesVersusExpensesByMonth(month, year);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<IncomesAndExpensesModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<IncomesAndExpensesModel>.Success(result.Data));
        }

        [Authorize]
        [HttpGet("expenses-by-category")]
        public async Task<IActionResult> GetExpensesByCategoryByMonth(int month, int year)
        {
            var result = await dashboardService.GetExpensesByCategoryByMonth(month, year);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<List<ExpensesByCategoryModel>>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<List<ExpensesByCategoryModel>>.Success(result.Data));
        }

        [Authorize]
        [HttpGet("expenses-by-payment-method")]
        public async Task<IActionResult> GetExpensesByPaymentMethodByMonth(int month, int year)
        {
            var result = await dashboardService.GetExpensesByPaymentMethodByMonth(month, year);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<List<ExpensesByPaymentMethodModel>>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<List<ExpensesByPaymentMethodModel>>.Success(result.Data));
        }
    }
}
