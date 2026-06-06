using FluentValidation;
using Microsoft.AspNetCore.Identity;
using ZenMoney.Application.Requests.Investment;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Investment
{
    public class UpdateInvestmentValidator : AbstractValidator<UpdateInvestmentRequest>
    {
        public UpdateInvestmentValidator(UserManager<Core.Entities.User> userManager, IInvestmentRepository investmentRepository)
        {
            Include(new CreateInvestmentValidator(userManager));

            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("O Id é obrigatório")
                .Must(id => investmentRepository.GetByIdAsync(id).Result != null)
                .WithMessage("O investimento não existe");
        }
    }
}
