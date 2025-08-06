using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Requests.Expense;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Validators.Expense
{
    public class UpdateExpenseValidator : AbstractValidator<UpdateExpenseRequest>
    {
        public UpdateExpenseValidator(ICategoryRepository categoryRepository, IPaymentMethodRepository paymentMethodRepository, IExpenseRepository expenseRepository)
        {
            Include(new CreateExpenseValidator(categoryRepository, paymentMethodRepository));

            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("O id é obrigatório")
                .Must(id => expenseRepository.ExistsAsync(x => x.Id == id).Result)
                .WithMessage("O gasto não existe");
        }
    }
}
