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
        public UpdateCategoryValidator(ICategoryRepository categoryRepository)
        {
            RuleFor(x => x.Id)
               .NotEmpty()
               .WithMessage("O id é obrigatório")
               .Must(id => categoryRepository.ExistsAsync(x => x.Id == id).Result)
               .WithMessage("A categoria não existe");

            RuleFor(request => request)
                .Must(request => !string.IsNullOrWhiteSpace(request.Name))
                .WithMessage("O nome é obrigatório")
                .Must(request => request.Name.Length <= 50)
                .WithMessage("O tamanho máximo do nome é de 50 caracteres")
                .Must(request => !categoryRepository.ExistsAsync(c => c.Id != request.Id && c.UserId == request.UserId && c.Name == request.Name).Result)
                .WithMessage("Já existe uma categoria cadastrada com este nome");
        }
    }
}
