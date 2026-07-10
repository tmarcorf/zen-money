using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Requests.Expense;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Services
{
    public class ExpenseService(
        IExpenseRepository expenseRepository,
        ICategoryRepository categoryRepository,
        IPaymentMethodRepository paymentMethodRepository,
        IHttpContextAccessor httpContextAccessor) : BaseService(httpContextAccessor), IExpenseService
    {
        public async Task<Result<ExpenseModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                return Result<ExpenseModel>.Failure(ErrorCodes.InvalidId);
            }

            var expense = await expenseRepository.GetByIdAsync(id);

            if (expense == null)
            {
                return Result<ExpenseModel>.Failure(ErrorCodes.ExpenseNotFound);
            }

            return Result<ExpenseModel>.Success(expense.ToModel());
        }

        public async Task<PaginatedResult<List<ExpenseModel>>> ListPaginatedAsync(SearchExpenseRequest request)
        {
            var userId = GetUserId();

            var expenses = await expenseRepository.ListPaginatedAsync(request, userId);
            var count = await expenseRepository.CountPaginatedAsync(request, userId);

            return PaginatedResult<List<ExpenseModel>>.Success(expenses.ToModels(), count);
        }

        public async Task<Result<ExpenseModel>> CreateAsync(CreateExpenseRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();

            var validationError = await ValidateCreateAsync(request);
            if (validationError.HasValue)
                return Result<ExpenseModel>.Failure(validationError.Value);

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

            var validationError = await ValidateUpdateAsync(request);
            if (validationError.HasValue)
                return Result<ExpenseModel>.Failure(validationError.Value);

            var expense = await expenseRepository.GetByIdAsync(request.Id);
            expense.UpdatedAt = DateTimeOffset.UtcNow;
            expense.Type = request.Type;
            expense.Date = request.Date;
            expense.Description = request.Description;
            expense.Amount = request.Amount;
            expense.IsPaid = request.IsPaid;
            expense.CategoryId = request.CategoryId;
            expense.PaymentMethodId = request.PaymentMethodId;

            await expenseRepository.UpdateEntityAsync(expense);

            return Result<ExpenseModel>.Success(expense.ToModel());
        }

        public async Task<Result<ExpenseModel>> DeleteAsync(Guid id)
        {
            var expense = await expenseRepository.GetByIdAsync(id);

            if (id.Equals(Guid.Empty) || expense == null)
            {
                return Result<ExpenseModel>.Failure(ErrorCodes.ExpenseNotFound);
            }

            expenseRepository.Delete(expense);
            await expenseRepository.SaveChangesAsync();

            return Result<ExpenseModel>.Success(expense.ToModel());
        }

        #region Private Validation Methods

        private async Task<ErrorCodes?> ValidateCreateAsync(CreateExpenseRequest request)
        {
            var commonError = await ValidateExpenseCommonFields(request);
            if (commonError.HasValue)
                return commonError;

            return null;
        }

        private async Task<ErrorCodes?> ValidateUpdateAsync(UpdateExpenseRequest request)
        {
            if (request.Id == Guid.Empty)
                return ErrorCodes.InvalidId;

            var exists = await expenseRepository.ExistsAsync(x => x.Id == request.Id);
            if (!exists)
                return ErrorCodes.ExpenseNotFound;

            var commonError = await ValidateExpenseCommonFields(request);
            if (commonError.HasValue)
                return commonError;

            return null;
        }

        private async Task<ErrorCodes?> ValidateExpenseCommonFields(CreateExpenseRequest request)
        {
            if (request.Type == default)
                return ErrorCodes.ExpenseTypeEmpty;

            var typeIsValid = request.Type == ExpenseTypeEnum.Fixed || request.Type == ExpenseTypeEnum.Variable;
            if (!typeIsValid)
                return ErrorCodes.ExpenseTypeInvalid;

            if (request.Date == default)
                return ErrorCodes.ExpenseDateEmpty;

            if (request.Date == DateOnly.MinValue)
                return ErrorCodes.ExpenseDateInvalid;

            if (string.IsNullOrWhiteSpace(request.Description))
                return ErrorCodes.ExpenseDescriptionEmpty;

            if (request.Description.Length > 100)
                return ErrorCodes.ExpenseDescriptionTooLong;

            if (request.Amount == default)
                return ErrorCodes.ExpenseAmountEmpty;

            if (request.Amount == decimal.MinValue)
                return ErrorCodes.ExpenseAmountInvalid;

            if (request.CategoryId == Guid.Empty)
                return ErrorCodes.ExpenseCategoryIdEmpty;

            var categoryExists = await categoryRepository.ExistsAsync(x => x.Id == request.CategoryId);
            if (!categoryExists)
                return ErrorCodes.ExpenseCategoryNotFound;

            if (request.PaymentMethodId == Guid.Empty)
                return ErrorCodes.ExpensePaymentMethodIdEmpty;

            var paymentMethodExists = await paymentMethodRepository.ExistsAsync(x => x.Id == request.PaymentMethodId);
            if (!paymentMethodExists)
                return ErrorCodes.ExpensePaymentMethodNotFound;

            return null;
        }

        #endregion
    }
}
