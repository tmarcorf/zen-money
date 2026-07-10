using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.API.Responses;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.User;
using ZenMoney.Core.Enums;

namespace ZenMoney.API.Controllers
{
    [Route("api/users")]
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
                return NotFound(ApiResponse<UserModel>.Failure(result.Error, "404"));
            }

            return Ok(ApiResponse<UserModel>.Success(result.Data));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateUserRequest request)
        {
            var result = await userService.CreateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<UserModel>.Failure(result.Error));
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
                return BadRequest(ApiResponse<UserModel>.Failure(result.Error));
            }

            return Ok(ApiResponse<UserModel>.Success(result.Data));
        }

        [HttpPost("auth")]
        public async Task<IActionResult> AuthenticateAsync(AuthUserRequest request)
        {
            var result = await userService.AuthenticateAsync(request);

            if (!result.IsSuccess)
            {
                return BadRequest(ApiResponse<TokenModel>.Failure(result.Error));
            }
            
            Response.Cookies.Append("auth_token", result.Data.Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Expires = result.Data.Expiration
            });

            return Ok(ApiResponse<TokenModel>.Success(result.Data));
        }

        [Authorize]
        [HttpGet("validate")]
        public IActionResult ValidateToken()
        {
            return Ok(ApiResponse<bool>.Success(true, "Token válido"));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> MeAsync()
        {
            // Use ClaimTypes.NameIdentifier because ASP.NET Core maps JWT "sub" to it by default
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var guid))
            {
                return Unauthorized(ApiResponse<UserModel>.Failure(ErrorCodes.InvalidSession, "401"));
            }

            var result = await userService.GetByIdAsync(guid);

            if (!result.IsSuccess)
            {
                return Unauthorized(ApiResponse<UserModel>.Failure(result.Error, "401"));
            }

            return Ok(ApiResponse<UserModel>.Success(result.Data));
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("auth_token");
            return Ok(ApiResponse<bool>.Success(true, "Logout realizado com sucesso"));
        }
    }
}
