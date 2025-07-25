using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System.Text.RegularExpressions;
using ZenMoney.Application.Requests.User;

namespace ZenMoney.Application.Validators.User
{
    public class CreateUserValidator : AbstractValidator<CreateUserRequest>
    {
        public CreateUserValidator(UserManager<Core.Entities.User> userManager)
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("O email é obrigatório")
                .Must(EmailIsValid)
                .WithMessage("O email informado é inválido")
                .Must(email => userManager.FindByEmailAsync(email).Result == null)
                .WithMessage("O email informado já existe")
                .MaximumLength(512)
                .WithMessage("O email deve ter no máximo 512 caracateres");

            RuleFor(x => x.Password)
                .NotEmpty()
                .WithMessage("A senha é obrigatória")
                .MinimumLength(8)
                .MaximumLength(20)
                .Must(PasswordIsValid)
                .WithMessage("A senha precisa ter pelo menos uma letra maiúscula, minúscula, caracter especial e número");

            RuleFor(x => x.FirstName)
                .NotEmpty()
                .WithMessage("O primeiro nome é obrigatório")
                .MaximumLength(100)
                .WithMessage("O primeiro nome deve ter no máximo 100 caracteres");

            RuleFor(x => x.LastName)
                .NotEmpty()
                .WithMessage("O último nome é obrigatório")
                .MaximumLength(100)
                .WithMessage("O último nome deve ter no máximo 100 caracteres");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .WithMessage("A data de nascimento é obrigatória")
                .LessThanOrEqualTo(DateOnly.FromDateTime(DateTimeOffset.Now.Date))
                .WithMessage("A data de nascimento não pode ser maior que a data atual");
        }

        private bool EmailIsValid(string email)
        {
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

            return Regex.IsMatch(email, pattern);
        }

        private bool PasswordIsValid(string password)
        {
            string pattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$";

            return Regex.IsMatch(password, pattern);
        }
    }
}
