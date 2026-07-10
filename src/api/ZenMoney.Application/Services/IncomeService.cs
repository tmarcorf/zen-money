using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Income;
using ZenMoney.Application.Requests.Income;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Services
{
    public class IncomeService(
        IIncomeRepository incomeRepository,
        IHttpContextAccessor httpContextAccessor) : BaseService(httpContextAccessor), IIncomeService
    {
        public async Task<Result<IncomeModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                return Result<IncomeModel>.Failure(ErrorCodes.InvalidId);
            }

            var income = await incomeRepository.GetByIdAsync(id);

            if (income == null)
            {
                return Result<IncomeModel>.Failure(ErrorCodes.IncomeNotFound);
            }

            return Result<IncomeModel>.Success(income.ToModel());
        }

        public async Task<PaginatedResult<List<IncomeModel>>> ListPaginatedAsync(SearchIncomeRequest request)
        {
            var userId = GetUserId();

            var incomes = await incomeRepository.ListPaginatedAsync(request, userId);
            var count = await incomeRepository.CountPaginatedAsync(request, userId);

            return PaginatedResult<List<IncomeModel>>.Success(incomes.ToModels(), count);
        }

        public async Task<Result<IncomeModel>> CreateAsync(CreateIncomeRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();

            var validationError = await ValidateCreateAsync(request);
            if (validationError.HasValue)
                return Result<IncomeModel>.Failure(validationError.Value);

            var income = new Income();
            income.CreatedAt = DateTimeOffset.UtcNow;
            income.Id = Guid.NewGuid();
            income.UserId = request.UserId;
            income.Description = request.Description;
            income.Type = request.Type;
            income.Date = request.Date;
            income.Amount = request.Amount;

            incomeRepository.Create(income);
            await incomeRepository.SaveChangesAsync();

            return Result<IncomeModel>.Success(income.ToModel());
        }

        public async Task<Result<IncomeModel>> UpdateAsync(UpdateIncomeRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();

            var validationError = await ValidateUpdateAsync(request);
            if (validationError.HasValue)
                return Result<IncomeModel>.Failure(validationError.Value);

            var income = await incomeRepository.GetByIdAsync(request.Id);
            income.UpdatedAt = DateTimeOffset.UtcNow;
            income.Description = request.Description;
            income.Type = request.Type;
            income.Date = request.Date;
            income.Amount = request.Amount;

            await incomeRepository.UpdateEntityAsync(income);

            return Result<IncomeModel>.Success(income.ToModel());
        }

        public async Task<Result<IncomeModel>> DeleteAsync(Guid id)
        {
            var income = await incomeRepository.GetByIdAsync(id);

            if (id.Equals(Guid.Empty) || income == null)
            {
                return Result<IncomeModel>.Failure(ErrorCodes.IncomeNotFound);
            }

            incomeRepository.Delete(income);
            await incomeRepository.SaveChangesAsync();

            return Result<IncomeModel>.Success(income.ToModel());
        }

        #region Private Validation Methods

        private Task<ErrorCodes?> ValidateCreateAsync(CreateIncomeRequest request)
        {
            return Task.FromResult(ValidateIncomeCommonFields(request));
        }

        private async Task<ErrorCodes?> ValidateUpdateAsync(UpdateIncomeRequest request)
        {
            if (request.Id == Guid.Empty)
                return ErrorCodes.InvalidId;

            var exists = await incomeRepository.ExistsAsync(x => x.Id == request.Id);
            if (!exists)
                return ErrorCodes.IncomeNotFound;

            var commonError = ValidateIncomeCommonFields(request);
            if (commonError.HasValue)
                return commonError;

            return null;
        }

        private static ErrorCodes? ValidateIncomeCommonFields(CreateIncomeRequest request)
        {
            if (request.Type == default)
                return ErrorCodes.IncomeTypeEmpty;

            var typeIsValid = request.Type == IncomeTypeEnum.Fixed || request.Type == IncomeTypeEnum.Variable;
            if (!typeIsValid)
                return ErrorCodes.IncomeTypeInvalid;

            if (request.Date == DateOnly.MinValue)
                return ErrorCodes.IncomeDateInvalid;

            if (string.IsNullOrWhiteSpace(request.Description))
                return ErrorCodes.IncomeDescriptionEmpty;

            if (request.Description.Length < 3)
                return ErrorCodes.IncomeDescriptionTooShort;

            if (request.Description.Length > 100)
                return ErrorCodes.IncomeDescriptionTooLong;

            if (request.Amount == decimal.Zero)
                return ErrorCodes.IncomeAmountEmpty;

            return null;
        }

        #endregion
    }
}
