using FluentValidation;
using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Investment;
using ZenMoney.Application.Requests.Investment;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Services
{
    public class InvestmentService(
        IInvestmentRepository investmentRepository,
        IValidator<CreateInvestmentRequest> createInvestmentValidator,
        IValidator<UpdateInvestmentRequest> updateInvestmentValidator,
        IHttpContextAccessor httpContextAccessor) : BaseService(httpContextAccessor), IInvestmentService
    {
        public async Task<Result<InvestmentModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<InvestmentModel>.Failure(errors);
            }

            var investment = await investmentRepository.GetByIdAsync(id);

            if (investment == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<InvestmentModel>.Failure(errors);
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
            var validationResult = createInvestmentValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<InvestmentModel>.Failure(errors);
            }

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
            var validationResult = updateInvestmentValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<InvestmentModel>.Failure(errors);
            }

            var investment = await investmentRepository.GetByIdAsync(request.Id);
            investment.UpdatedAt = DateTimeOffset.UtcNow;
            investment.Name = request.Name;
            investment.Type = request.Type;
            investment.InvestedAmount = request.InvestedAmount;
            investment.CurrentValue = request.CurrentValue;
            investment.Date = request.Date;
            investment.Notes = request.Notes;

            investmentRepository.Update(investment);
            await investmentRepository.SaveChangesAsync();

            return Result<InvestmentModel>.Success(investment.ToModel());
        }

        public async Task<Result<InvestmentModel>> DeleteAsync(Guid id)
        {
            var investment = await investmentRepository.GetByIdAsync(id);

            if (id.Equals(Guid.Empty) || investment == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<InvestmentModel>.Failure(errors);
            }

            investmentRepository.Delete(investment);
            await investmentRepository.SaveChangesAsync();

            return Result<InvestmentModel>.Success(investment.ToModel());
        }
    }
}
