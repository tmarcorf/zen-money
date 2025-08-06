using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Requests.Expense;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Expense
{
    public class CreateExpenseValidator : AbstractValidator<CreateExpenseRequest>
    {
        public CreateExpenseValidator(ICategoryRepository categoryRepository, IPaymentMethodRepository paymentMethodRepository)
        {
            RuleFor(x => x.Type)
                .NotEmpty()
                .WithMessage("O tipo é obrigatório")
                .Must(TypeIsValid)
                .WithMessage("O tipo está inválido");

            RuleFor(x => x.Date)
                .NotEmpty()
                .WithMessage("A data é obrigatória")
                .GreaterThan(DateOnly.MinValue)
                .WithMessage("A data está inválida");

            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("A descrição é obrigatória")
                .MaximumLength(100)
                .WithMessage("O tamanho máximo para a descrição é de 100 caracateres");

            RuleFor(x => x.Amount)
                .NotEmpty()
                .WithMessage("O valor é obrigatório")
                .GreaterThan(decimal.MinValue)
                .WithMessage("O valor não pode estar zerado");

            RuleFor(x => x.CategoryId)
                .NotEmpty()
                .WithMessage("A categoria do gasto é obrigatória")
                .Must(categoryId => categoryRepository.ExistsAsync(x => x.Id == categoryId).Result)
                .WithMessage("A categoria informada não existe");

            RuleFor(x => x.PaymentMethodId)
                .NotEmpty()
                .WithMessage("A forma de pagamento do gasto é obrigatória")
                .Must(paymentMethodId => paymentMethodRepository.ExistsAsync(x => x.Id == paymentMethodId).Result)
                .WithMessage("A forma de pagamento informada não existe");

        }

        private bool TypeIsValid(ExpenseTypeEnum type)
        {
            return type.Equals(ExpenseTypeEnum.FIXED) || type.Equals(ExpenseTypeEnum.VARIABLE);
        }
    }
}
