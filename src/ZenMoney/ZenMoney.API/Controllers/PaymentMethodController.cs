using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.PaymentMethod;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Requests.PaymentMethod;
using ZenMoney.Application.Services;
using ZenMoney.Core.Search;

namespace ZenMoney.API.Controllers
{
    [Route("api/payment-methods")]
    [ApiController]
    public class PaymentMethodController(
        IPaymentMethodService paymentMethodService) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var result = await paymentMethodService.GetByIdAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<PaymentMethodModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<PaymentMethodModel>.Success(result.Data));
        }

        [Authorize]
        [HttpGet("list-paginated")]
        public async Task<IActionResult> ListPaginatedAsync([FromQuery] SearchPaymentMethodRequest request)
        {
            var result = await paymentMethodService.ListPaginatedAsync(request);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<List<PaymentMethodModel>>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<List<PaymentMethodModel>>.Success(result.Data, totalCount: result.TotalCount));
        }

        [Authorize]
        [HttpGet("list-description")]
        public async Task<IActionResult> ListByDescriptionAsync(string? description)
        {
            var result = await paymentMethodService.ListByDescriptionAsync(description);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<List<PaymentMethodModel>>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<List<PaymentMethodModel>>.Success(result.Data));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreatePaymentMethodRequest request)
        {
            var result = await paymentMethodService.CreateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<PaymentMethodModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<PaymentMethodModel>.Success(result.Data));
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdatePaymentMethodRequest request)
        {
            var result = await paymentMethodService.UpdateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<PaymentMethodModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<PaymentMethodModel>.Success(result.Data));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var result = await paymentMethodService.DeleteAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<PaymentMethodModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<PaymentMethodModel>.Success(result.Data));
        }
    }
}
