using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Category
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryRequest>
    {
        public CreateCategoryValidator(ICategoryRepository categoryRepository)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("O nome é obrigatório")
                .MaximumLength(50)
                .Must(name => !categoryRepository.ExistsAsync(c => c.Name == name).Result)
                .WithMessage("Já existe uma categoria cadastrada com este nome");
        }
    }
}
