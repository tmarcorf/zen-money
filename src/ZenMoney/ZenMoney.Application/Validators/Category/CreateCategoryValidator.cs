using FluentValidation;
using Microsoft.AspNetCore.Identity;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Category
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryRequest>
    {
        public CreateCategoryValidator(ICategoryRepository categoryRepository, UserManager<Core.Entities.User> userManager)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("O nome é obrigatório")
                .MaximumLength(50)
                .Must(name => !categoryRepository.ExistsAsync(c => c.Name == name).Result)
                .WithMessage("Já existe uma categoria cadastrada com este nome");

            RuleFor(x => x.UserId)
               .NotEmpty()
               .Must(userId => userManager.FindByIdAsync(userId.ToString()).Result != null)
               .WithMessage("O id do usuário é obrigatório");
        }
    }
}
