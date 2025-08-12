using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Requests.Category;

namespace ZenMoney.API.Controllers
{
    [Route("api/categories")]
    [ApiController]
    public class CategoryController(
        ICategoryService categoryService) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetByIdAsync(Guid id)
        {
            var result = await categoryService.GetByIdAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<CategoryModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<CategoryModel>.Success(result.Data));
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync([FromBody] SearchCategoryRequest request)
        {
            var result = await categoryService.GetAllAsync(request);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<List<CategoryModel>>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<List<CategoryModel>>.Success(result.Data));
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
                return NotFound(ApiResponse<CategoryModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<CategoryModel>.Success(result.Data));
        }
    }
}
