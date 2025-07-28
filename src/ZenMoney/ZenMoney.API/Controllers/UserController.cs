using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.User;

namespace ZenMoney.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController(
        IUserService userService
        ) : ControllerBase
    {
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await userService.GetByIdAsync(id);

            if (!result.IsSuccess)
            {
                return NotFound(ApiResponse<UserModel>.Failure(result.Errors, "404"));
            }

            return Ok(ApiResponse<UserModel>.Success(result.Data));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateUserRequest request)
        {
            var result = await userService.CreateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<UserModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<UserModel>.Success(result.Data));
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync(UpdateUserRequest request)
        {
            var result = await userService.UpdateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<UserModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<UserModel>.Success(result.Data));
        }

        [HttpPost("auth")]
        public async Task<IActionResult> AuthenticateAsync(AuthUserRequest request)
        {
            var result = await userService.AuthenticateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<TokenModel>.Failure(result.Errors));
            }

            return Ok(ApiResponse<TokenModel>.Success(result.Data));
        }
    }
}
