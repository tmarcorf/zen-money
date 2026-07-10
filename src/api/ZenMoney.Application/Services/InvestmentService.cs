using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Investment;
using ZenMoney.Application.Requests.Investment;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Services
{
    public class InvestmentService(
        IInvestmentRepository investmentRepository,
        IHttpContextAccessor httpContextAccessor) : BaseService(httpContextAccessor), IInvestmentService
    {
        public async Task<Result<InvestmentModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                return Result<InvestmentModel>.Failure(ErrorCodes.InvalidId);
            }

            var investment = await investmentRepository.GetByIdAsync(id);

            if (investment == null)
            {
                return Result<InvestmentModel>.Failure(ErrorCodes.InvestmentNotFound);
            }

            return Result<InvestmentModel>.Success(investment.ToModel());
        }

        public async Task<PaginatedResult<List<InvestmentModel>>> ListPaginatedAsync(SearchInvestmentRequest request)
        {
            var userId = GetUserId();

            var investments = await investmentRepository.ListPaginatedAsync(request, userId);
            var count = await investmentRepository.CountPaginatedAsync(request, userId);

            return PaginatedResult<List<InvestmentModel>>.Success(investments.ToModels(), count);
        }

        public async Task<Result<InvestmentModel>> CreateAsync(CreateInvestmentRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();

            var validationError = await ValidateCreateAsync(request);
            if (validationError.HasValue)
                return Result<InvestmentModel>.Failure(validationError.Value);

            var investment = new Investment();
            investment.CreatedAt = DateTimeOffset.UtcNow;
            investment.Id = Guid.NewGuid();
            investment.UserId = request.UserId;
            investment.Name = request.Name;
            investment.Type = request.Type;
            investment.InvestedAmount = request.InvestedAmount;
            investment.CurrentValue = request.CurrentValue;
            investment.Date = request.Date;
            investment.Notes = request.Notes;

            investmentRepository.Create(investment);
            await investmentRepository.SaveChangesAsync();

            return Result<InvestmentModel>.Success(investment.ToModel());
        }

        public async Task<Result<InvestmentModel>> UpdateAsync(UpdateInvestmentRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();

            var validationError = await ValidateUpdateAsync(request);
            if (validationError.HasValue)
                return Result<InvestmentModel>.Failure(validationError.Value);

            var investment = await investmentRepository.GetByIdAsync(request.Id);
            investment.UpdatedAt = DateTimeOffset.UtcNow;
            investment.Name = request.Name;
            investment.Type = request.Type;
            investment.InvestedAmount = request.InvestedAmount;
            investment.CurrentValue = request.CurrentValue;
            investment.Date = request.Date;
            investment.Notes = request.Notes;

            await investmentRepository.UpdateEntityAsync(investment);

            return Result<InvestmentModel>.Success(investment.ToModel());
        }

        public async Task<Result<InvestmentModel>> DeleteAsync(Guid id)
        {
            var investment = await investmentRepository.GetByIdAsync(id);

            if (id.Equals(Guid.Empty) || investment == null)
            {
                return Result<InvestmentModel>.Failure(ErrorCodes.InvestmentNotFound);
            }

            investmentRepository.Delete(investment);
            await investmentRepository.SaveChangesAsync();

            return Result<InvestmentModel>.Success(investment.ToModel());
        }

        #region Private Validation Methods

        private Task<ErrorCodes?> ValidateCreateAsync(CreateInvestmentRequest request)
        {
            return Task.FromResult(ValidateInvestmentCommonFields(request));
        }

        private async Task<ErrorCodes?> ValidateUpdateAsync(UpdateInvestmentRequest request)
        {
            if (request.Id == Guid.Empty)
                return ErrorCodes.InvalidId;

            var exists = await investmentRepository.ExistsAsync(x => x.Id == request.Id);
            if (!exists)
                return ErrorCodes.InvestmentNotFound;

            var commonError = ValidateInvestmentCommonFields(request);
            if (commonError.HasValue)
                return commonError;

            return null;
        }

        private static ErrorCodes? ValidateInvestmentCommonFields(CreateInvestmentRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return ErrorCodes.InvestmentNameEmpty;

            if (request.Name.Length < 3)
                return ErrorCodes.InvestmentNameTooShort;

            if (request.Name.Length > 100)
                return ErrorCodes.InvestmentNameTooLong;

            if (string.IsNullOrWhiteSpace(request.Type))
                return ErrorCodes.InvestmentTypeEmpty;

            if (request.Type.Length > 50)
                return ErrorCodes.InvestmentTypeTooLong;

            if (request.InvestedAmount <= decimal.Zero)
                return ErrorCodes.InvestmentAmountInvalid;

            if (request.CurrentValue < decimal.Zero)
                return ErrorCodes.InvestmentCurrentValueNegative;

            if (request.Date == DateOnly.MinValue)
                return ErrorCodes.InvestmentDateInvalid;

            if (!string.IsNullOrEmpty(request.Notes) && request.Notes.Length > 500)
                return ErrorCodes.InvestmentNotesTooLong;

            return null;
        }

        #endregion
    }
}
