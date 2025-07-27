using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Requests.User;
using ZenMoney.Application.Services;

namespace ZenMoney.API.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController(
        ICategoryService categoryService
        ) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var result = await categoryService.GetByIdAsync(id);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<CategoryModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<CategoryModel>.Success(result.Data));
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateCategoryRequest request)
        {
            var result = await categoryService.CreateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<CategoryModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<CategoryModel>.Success(result.Data));
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdateCategoryRequest request)
        {
            var result = await categoryService.UpdateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<CategoryModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<CategoryModel>.Success(result.Data));
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(Guid id)
        {
            var result = await categoryService.DeleteAsync(id);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<CategoryModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<CategoryModel>.Success(result.Data));
        }
    }
}
