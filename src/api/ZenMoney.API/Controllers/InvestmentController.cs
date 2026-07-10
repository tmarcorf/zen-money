using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Investment;
using ZenMoney.Application.Requests.Investment;
using ZenMoney.Core.Search;

namespace ZenMoney.API.Controllers
{
    [Route("api/investments")]
    [ApiController]
    public class InvestmentController(
        IInvestmentService investmentService) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var result = await investmentService.GetByIdAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<InvestmentModel>.Failure(result.Error, "404"));
            }

            return Ok(ApiResponse<InvestmentModel>.Success(result.Data));
        }

        [Authorize]
        [HttpGet("list-paginated")]
        public async Task<IActionResult> ListPaginatedAsync([FromQuery] SearchInvestmentRequest request)
        {
            var result = await investmentService.ListPaginatedAsync(request);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<List<InvestmentModel>>.Failure(result.Error, "404"));
            }

            return Ok(ApiResponse<List<InvestmentModel>>.Success(result.Data, totalCount: result.TotalCount));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateInvestmentRequest request)
        {
            var result = await investmentService.CreateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<InvestmentModel>.Failure(result.Error));
            }

            return Ok(ApiResponse<InvestmentModel>.Success(result.Data));
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdateInvestmentRequest request)
        {
            var result = await investmentService.UpdateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<InvestmentModel>.Failure(result.Error));
            }

            return Ok(ApiResponse<InvestmentModel>.Success(result.Data));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var result = await investmentService.DeleteAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<InvestmentModel>.Failure(result.Error, "404"));
            }

            return Ok(ApiResponse<InvestmentModel>.Success(result.Data));
        }
    }
}
