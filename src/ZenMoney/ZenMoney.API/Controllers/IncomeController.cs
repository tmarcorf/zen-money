using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.Income;
using ZenMoney.Application.Requests.Income;
using ZenMoney.Application.Services;
using ZenMoney.Core.Search;

namespace ZenMoney.API.Controllers
{
    [Route("api/incomes")]
    [ApiController]
    public class IncomeController(
        IIncomeService incomeService) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var result = await incomeService.GetByIdAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<IncomeModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<IncomeModel>.Success(result.Data));
        }

        [Authorize]
        [HttpGet("list-paginated")]
        public async Task<IActionResult> ListPaginatedAsync([FromQuery] SearchIncomeRequest request)
        {
            var result = await incomeService.ListPaginatedAsync(request);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<List<IncomeModel>>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<List<IncomeModel>>.Success(result.Data, totalCount: result.TotalCount));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateIncomeRequest request)
        {
            var result = await incomeService.CreateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<IncomeModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<IncomeModel>.Success(result.Data));
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdateIncomeRequest request)
        {
            var result = await incomeService.UpdateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<IncomeModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<IncomeModel>.Success(result.Data));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var result = await incomeService.DeleteAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<IncomeModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<IncomeModel>.Success(result.Data));
        }
    }
}
