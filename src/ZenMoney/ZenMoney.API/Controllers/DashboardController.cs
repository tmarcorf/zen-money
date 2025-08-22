using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Dashboard;
using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Services;

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
            var result = await dashboardService.GetIncomesVersusExpensesPerMonth(month, year);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<IncomesAndExpensesModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<IncomesAndExpensesModel>.Success(result.Data));
        }
    }
}
