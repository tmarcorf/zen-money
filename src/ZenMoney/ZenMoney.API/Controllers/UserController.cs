using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Requests.User;

namespace ZenMoney.API.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController(
        IUserService userService) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = userService.GetByIdAsync(id);

            if (result == null) return NotFound();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(CreateUserRequest request)
        {
            var result = await userService.CreateAsync(request);

            if (result == null) return BadRequest();

            return Ok(result);
        }
    }
}
