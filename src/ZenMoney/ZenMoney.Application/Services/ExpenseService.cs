using FluentValidation;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Models.Income;
using ZenMoney.Application.Requests.Expense;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ZenMoney.Application.Services
{
    public class ExpenseService(
        IExpenseRepository expenseRepository,
        IHttpContextAccessor httpContextAccessor,
        IValidator<CreateExpenseRequest> createExpenseValidator,
        IValidator<UpdateExpenseRequest> updateExpenseValidator) : BaseService(httpContextAccessor), IExpenseService
    {
        public async Task<Result<ExpenseModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<ExpenseModel>.Failure(errors);
            }

            var expense = await expenseRepository.GetByIdAsync(id);

            if (expense == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<ExpenseModel>.Failure(errors);
            }

            return Result<ExpenseModel>.Success(expense.ToModel());
        }

        public async Task<PaginatedResult<List<ExpenseModel>>> ListPaginatedAsync(SearchExpenseRequest request)
        {
            var userId = GetUserId();

            var expenses = await expenseRepository.ListPaginatedAsync(request, userId);
            var count = await expenseRepository.CountAsync(userId);

            return PaginatedResult<List<ExpenseModel>>.Success(expenses.ToModels(), count);
        }

        public async Task<Result<ExpenseModel>> CreateAsync(CreateExpenseRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();
            var validationResult = createExpenseValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<ExpenseModel>.Failure(errors);
            }

            var expense = new Expense();
            expense.CreatedAt = DateTimeOffset.UtcNow;
            expense.Id = Guid.NewGuid();
            expense.UserId = request.UserId;
            expense.Type = request.Type;
            expense.Date = request.Date;
            expense.Description = request.Description;
            expense.Amount = request.Amount;
            expense.IsPaid = request.IsPaid;
            expense.CategoryId = request.CategoryId;
            expense.PaymentMethodId = request.PaymentMethodId;

            expenseRepository.Create(expense);
            await expenseRepository.SaveChangesAsync();

            return Result<ExpenseModel>.Success(expense.ToModel());
        }

        public async Task<Result<ExpenseModel>> UpdateAsync(UpdateExpenseRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();
            var validationResult = updateExpenseValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<ExpenseModel>.Failure(errors);
            }

            var expense = await expenseRepository.GetByIdAsync(request.Id);
            expense.UpdatedAt = DateTimeOffset.UtcNow;
            expense.Type = request.Type;
            expense.Date = request.Date;
            expense.Description = request.Description;
            expense.Amount = request.Amount;
            expense.IsPaid = request.IsPaid;
            expense.CategoryId = request.CategoryId;
            expense.PaymentMethodId = request.PaymentMethodId;

            expenseRepository.Update(expense);
            await expenseRepository.SaveChangesAsync();

            return Result<ExpenseModel>.Success(expense.ToModel());
        }

        public async Task<Result<ExpenseModel>> DeleteAsync(Guid id)
        {
            var expense = await expenseRepository.GetByIdAsync(id);

            if (id.Equals(Guid.Empty) || expense == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<ExpenseModel>.Failure(errors);
            }

            expenseRepository.Delete(expense);
            await expenseRepository.SaveChangesAsync();

            return Result<ExpenseModel>.Success(expense.ToModel());
        }
    }
}
