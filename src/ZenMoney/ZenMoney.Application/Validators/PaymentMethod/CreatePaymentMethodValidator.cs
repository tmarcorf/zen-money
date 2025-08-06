using FluentValidation;
using Microsoft.AspNetCore.Identity;
using ZenMoney.Application.Requests.PaymentMethod;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.PaymentMethod
{
    public class CreatePaymentMethodValidator : AbstractValidator<CreatePaymentMethodRequest>
    {
        public CreatePaymentMethodValidator(UserManager<Core.Entities.User> userManager, IPaymentMethodRepository paymentMethodRepository)
        {
            RuleFor(request => request)
                .NotEmpty()
                .WithMessage("A descrição é obrigatória")
                .Must(request => request.Description.Length <= 50)
                .WithMessage("O tamanho máximo da descrição é de 50 caracteres")
                .Must(request => !paymentMethodRepository.ExistsAsync(p => p.UserId == request.UserId && p.Description == request.Description).Result)
                .WithMessage("Já existe um método de pagamento cadastrado com este nome");

            RuleFor(x => x.UserId)
               .NotEmpty()
               .Must(userId => userManager.FindByIdAsync(userId.ToString()).Result != null)
               .WithMessage("O id do usuário é obrigatório");
        }
    }
}
