using FluentValidation;
using Microsoft.AspNetCore.Identity;
using ZenMoney.Application.Requests.User;

namespace ZenMoney.Application.Validators.User
{
    public class UpdateUserValidator : AbstractValidator<UpdateUserRequest>
    {
        public UpdateUserValidator(UserManager<Core.Entities.User> userManager)
        {
            Include(new BaseUserValidator());

            RuleFor(x => x.Id)
                .NotEmpty()
                .Must(id => userManager.FindByIdAsync(id.ToString()).Result != null)
                .WithMessage("O Id informado não existe");
        }
    }
}
