using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Requests.Income;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Validators.Income
{
    public class CreateIncomeValidator : AbstractValidator<CreateIncomeRequest>
    {
        public CreateIncomeValidator(UserManager<Core.Entities.User> userManager)
        {
            RuleFor(x => x.Type)
                .NotEmpty()
                .WithMessage("O tipo da entrada é obrigatório")
                .Must(TypeIsValid)
                .WithMessage("O tipo da entrada está inválido");

            RuleFor(x => x.Date)
                .NotEmpty()
                .NotEqual(DateOnly.MinValue)
                .WithMessage("A data da entrada está inválida");

            RuleFor(x => x.Description)
                .NotEmpty()
                .MinimumLength(3)
                .WithMessage("A descrição deve ter pelo menos 3 caracteres")
                .MaximumLength(100)
                .WithMessage("A descrição deve ter no máximo 100 caracteres");

            RuleFor(x => x.Amount)
                .NotEmpty()
                .NotEqual(decimal.Zero)
                .WithMessage("O valor da entrada é obrigatório");

            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("O Id do usuário é obrigatório")
                .Must(userId => userManager.FindByIdAsync(userId.ToString()).Result != null)
                .WithMessage("O usuário informado não existe");
        }

        private bool TypeIsValid(IncomeTypeEnum type)
        {
            return type == IncomeTypeEnum.Fixed || type == IncomeTypeEnum.Variable;
        }
    }
}
