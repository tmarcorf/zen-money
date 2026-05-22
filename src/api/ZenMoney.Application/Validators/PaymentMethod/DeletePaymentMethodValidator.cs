using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.PaymentMethod
{
    public class DeletePaymentMethodValidator : AbstractValidator<Core.Entities.PaymentMethod>
    {
        public DeletePaymentMethodValidator(IPaymentMethodRepository paymentMethodRepository)
        {
            RuleFor(paymentMethod => paymentMethod)
                .Must(paymentMethod => !paymentMethodRepository.IsBeingUsed(paymentMethod.Id, paymentMethod.UserId).Result)
                .WithMessage(p => $"Não é possível remover a forma de pagamento {p.Description} pois está vinculada a um gasto");
        }
    }
}
