using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Category
{
    public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryRequest>
    {
        public UpdateCategoryValidator(ICategoryRepository categoryRepository, UserManager<Core.Entities.User> userManager)
        {
            RuleFor(x => x.Id)
               .NotEmpty()
               .WithMessage("O id é obrigatório")
               .Must(id => categoryRepository.ExistsAsync(x => x.Id == id).Result)
               .WithMessage("A categoria não existe");

            RuleFor(category => category)
                .NotEmpty()
                .WithMessage("O nome é obrigatório")
                .Must(category => category.Name.Length <= 50)
                .WithMessage("O tamanho máximo do nome é de 50 caracteres")
                .Must(category => !categoryRepository.ExistsAsync(c => c.Id != category.Id && c.Name == category.Name).Result)
                .WithMessage("Já existe uma categoria cadastrada com este nome");
        }
    }
}
