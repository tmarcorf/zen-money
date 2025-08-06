using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;
using ZenMoney.Application.Requests.User;

namespace ZenMoney.Application.Validators.User
{
    public class CreateUserValidator : AbstractValidator<CreateUserRequest>
    {
        public CreateUserValidator(UserManager<Core.Entities.User> userManager)
        {
            Include(new BaseUserValidator());

            RuleFor(x => x.Email)
                .Must(email => userManager.FindByEmailAsync(email).Result == null)
                .WithMessage("O email informado já existe");
        }
    }
}
