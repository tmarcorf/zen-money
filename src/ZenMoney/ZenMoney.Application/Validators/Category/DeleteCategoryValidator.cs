using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Category
{
    public class DeleteCategoryValidator : AbstractValidator<Core.Entities.Category>
    {
        public DeleteCategoryValidator(ICategoryRepository categoryRepository)
        {
            RuleFor(category => category)
                .Must(category => !categoryRepository.IsBeingUsed(category.Id, category.UserId).Result)
                .WithMessage(c => $"Não é possível remover a categoria {c.Name} pois está vinculada a um gasto");
        }
    }
}
