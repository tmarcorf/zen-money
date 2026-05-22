using FluentValidation;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Requests.Income;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Income
{
    public class UpdateIncomeValidator : AbstractValidator<UpdateIncomeRequest>
    {
        public UpdateIncomeValidator(UserManager<Core.Entities.User> userManager, IIncomeRepository incomeRepository)
        {
            Include(new CreateIncomeValidator(userManager));

            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("O Id é obrigatório")
                .Must(id => incomeRepository.GetByIdAsync(id).Result != null)
                .WithMessage("A entrada não existe");
        }
    }
}
