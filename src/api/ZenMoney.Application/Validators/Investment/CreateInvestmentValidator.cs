using FluentValidation;
using Microsoft.AspNetCore.Identity;
using ZenMoney.Application.Requests.Investment;

namespace ZenMoney.Application.Validators.Investment
{
    public class CreateInvestmentValidator : AbstractValidator<CreateInvestmentRequest>
    {
        public CreateInvestmentValidator(UserManager<Core.Entities.User> userManager)
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("O nome do investimento é obrigatório")
                .MinimumLength(3)
                .WithMessage("O nome deve ter pelo menos 3 caracteres")
                .MaximumLength(100)
                .WithMessage("O nome deve ter no máximo 100 caracteres");

            RuleFor(x => x.Type)
                .NotEmpty()
                .WithMessage("O tipo do investimento é obrigatório")
                .MaximumLength(50)
                .WithMessage("O tipo deve ter no máximo 50 caracteres");

            RuleFor(x => x.InvestedAmount)
                .NotEmpty()
                .GreaterThan(decimal.Zero)
                .WithMessage("O valor investido deve ser maior que zero");

            RuleFor(x => x.CurrentValue)
                .GreaterThanOrEqualTo(decimal.Zero)
                .WithMessage("O valor atual não pode ser negativo");

            RuleFor(x => x.Date)
                .NotEmpty()
                .NotEqual(DateOnly.MinValue)
                .WithMessage("A data do investimento está inválida");

            RuleFor(x => x.Notes)
                .MaximumLength(500)
                .WithMessage("As observações devem ter no máximo 500 caracteres");

            RuleFor(x => x.UserId)
                .NotEmpty()
                .WithMessage("O Id do usuário é obrigatório")
                .Must(userId => userManager.FindByIdAsync(userId.ToString()).Result != null)
                .WithMessage("O usuário informado não existe");
        }
    }
}
