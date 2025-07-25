using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.User;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Services
{
    public class UserService(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IValidator<CreateUserRequest> createUserValidator) : IUserService
    {
        public async Task<UserModel> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty)) return null;

            var user = await userManager.Users.FirstOrDefaultAsync(x => x.Id == id);

            return user.ToModel();
        }

        public async Task<UserModel> CreateAsync(CreateUserRequest request)
        {
            if (request == null) return null;
            
            var validationResult = createUserValidator.Validate(request);

            if (!validationResult.IsValid) return null;

            var user = request.ToEntity();
            user.Id = Guid.NewGuid();

            var result = await userManager.CreateAsync(user, request.Password);

            return user.ToModel();
        }
    }
}
