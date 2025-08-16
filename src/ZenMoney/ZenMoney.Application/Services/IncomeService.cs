using FluentValidation;
using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.Income;
using ZenMoney.Application.Requests.Income;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace ZenMoney.Application.Services
{
    public class IncomeService(
        IIncomeRepository incomeRepository,
        IValidator<CreateIncomeRequest> createIncomeValidator,
        IValidator<UpdateIncomeRequest> updateIncomeValidator,
        IHttpContextAccessor httpContextAccessor) : BaseService(httpContextAccessor), IIncomeService
    {
        public async Task<Result<IncomeModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<IncomeModel>.Failure(errors);
            }

            var income = await incomeRepository.GetByIdAsync(id);

            if (income == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<IncomeModel>.Failure(errors);
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
            var validationResult = createIncomeValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<IncomeModel>.Failure(errors);
            }

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
            var validationResult = updateIncomeValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<IncomeModel>.Failure(errors);
            }

            var income = await incomeRepository.GetByIdAsync(request.Id);
            income.UpdatedAt = DateTimeOffset.UtcNow;
            income.Description = request.Description;
            income.Type = request.Type;
            income.Date = request.Date;
            income.Amount = request.Amount;

            incomeRepository.Update(income);
            await incomeRepository.SaveChangesAsync();

            return Result<IncomeModel>.Success(income.ToModel());
        }

        public async Task<Result<IncomeModel>> DeleteAsync(Guid id)
        {
            var income = await incomeRepository.GetByIdAsync(id);

            if (id.Equals(Guid.Empty) || income == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<IncomeModel>.Failure(errors);
            }

            incomeRepository.Delete(income);
            await incomeRepository.SaveChangesAsync();

            return Result<IncomeModel>.Success(income.ToModel());
        }
    }
}
