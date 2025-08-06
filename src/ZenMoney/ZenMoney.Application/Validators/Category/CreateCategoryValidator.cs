using FluentValidation;
using Microsoft.AspNetCore.Identity;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Category
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryRequest>
    {
        public CreateCategoryValidator(ICategoryRepository categoryRepository, UserManager<Core.Entities.User> userManager)
        {
            RuleFor(category => category)
                .Must(category => !string.IsNullOrWhiteSpace(category.Name))
                .WithMessage("O nome é obrigatório")
                .Must(category => category.Name.Length <= 50)
                .WithMessage("O tamanho máximo do nome é de 50 caracteres")
                .Must(category => !categoryRepository.ExistsAsync(c => c.UserId == category.UserId && c.Name == category.Name).Result)
                .WithMessage("Já existe uma categoria cadastrada com este nome");
        }
    }
}
