using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Requests;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Validators
{
    public class CreateIncomeValidator : AbstractValidator<CreateIncomeRequest>
    {
        public CreateIncomeValidator()
        {
            RuleFor(x => x.Type)
                .NotEmpty()
                .WithMessage("O tipo da entrada é obrigatório")
                .Must(TypeIsValid)
                .WithMessage("O tipo da entrada está inválido");

            RuleFor(x => x.Date)
                .NotEmpty()
                .NotEqual(DateOnly.MinValue);

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
        }

        private bool TypeIsValid(IncomeTypeEnum type)
        {
            return type == IncomeTypeEnum.FIXED || type == IncomeTypeEnum.VARIABLE;
        }
    }
}
