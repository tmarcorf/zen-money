using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Models.Income;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Requests.Expense;
using ZenMoney.Application.Services;
using ZenMoney.Core.Search;

namespace ZenMoney.API.Controllers
{
    [Route("api/expenses")]
    [ApiController]
    public class ExpenseController(IExpenseService expenseService) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var result = await expenseService.GetByIdAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<ExpenseModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<ExpenseModel>.Success(result.Data));
        }

        [Authorize]
        [HttpGet("list-paginated")]
        public async Task<IActionResult> ListPaginatedAsync([FromQuery] SearchExpenseRequest request)
        {
            var result = await expenseService.ListPaginatedAsync(request);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<List<ExpenseModel>>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<List<ExpenseModel>>.Success(result.Data, totalCount: result.TotalCount));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateExpenseRequest request)
        {
            var result = await expenseService.CreateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<ExpenseModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<ExpenseModel>.Success(result.Data));
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdateExpenseRequest request)
        {
            var result = await expenseService.UpdateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<ExpenseModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<ExpenseModel>.Success(result.Data));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var result = await expenseService.DeleteAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<ExpenseModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<ExpenseModel>.Success(result.Data));
        }
    }
}
