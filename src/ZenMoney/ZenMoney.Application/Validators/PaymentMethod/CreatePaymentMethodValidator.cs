using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Requests.PaymentMethod;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.PaymentMethod
{
    public class CreatePaymentMethodValidator : AbstractValidator<CreatePaymentMethodRequest>
    {
        public CreatePaymentMethodValidator(IPaymentMethodRepository paymentMethodRepository)
        {
            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("A descrição é obrigatória")
                .MaximumLength(50)
                .Must(description => !paymentMethodRepository.ExistsAsync(p => p.Description == description).Result)
                .WithMessage("Já existe um método de pagamento cadastrado com esta descrição");
        }
    }
}
