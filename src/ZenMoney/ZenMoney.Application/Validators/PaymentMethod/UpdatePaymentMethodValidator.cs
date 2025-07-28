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
    public class UpdatePaymentMethodValidator : AbstractValidator<UpdatePaymentMethodRequest>
    {
        public UpdatePaymentMethodValidator(IPaymentMethodRepository paymentMethodRepository)
        {
            RuleFor(x => x.Id)
               .NotEmpty()
               .WithMessage("O id é obrigatório")
               .Must(id => paymentMethodRepository.ExistsAsync(x => x.Id == id).Result)
               .WithMessage("O método de pagamento não existe");

            RuleFor(request => request)
                .NotEmpty()
                .WithMessage("A descrição é obrigatória")
                .Must(request => request.Description.Length <= 50)
                .WithMessage("O tamanho máximo da descrição é de 50 caracteres")
                .Must(request => !paymentMethodRepository.ExistsAsync(p => p.Id != request.Id && p.Description == request.Description).Result)
                .WithMessage("Já existe um método de pagamento cadastrado com este nome");
        }
    }
}
