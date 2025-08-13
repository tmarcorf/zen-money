using FluentValidation;
using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.PaymentMethod;
using ZenMoney.Application.Requests.PaymentMethod;
using ZenMoney.Application.Results;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Services
{
    public class PaymentMethodService(
        IPaymentMethodRepository paymentMethodRepository,
        IValidator<CreatePaymentMethodRequest> createPaymentMethodValidator,
        IValidator<UpdatePaymentMethodRequest> updatePaymentMethodValidator,
        IHttpContextAccessor httpContextAcessor) : BaseService(httpContextAcessor), IPaymentMethodService
    {
        public async Task<Result<PaymentMethodModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<PaymentMethodModel>.Failure(errors);
            }

            var paymentMethod = await paymentMethodRepository.GetByIdAsync(id);

            if (paymentMethod == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<PaymentMethodModel>.Failure(errors);
            }

            return Result<PaymentMethodModel>.Success(paymentMethod.ToModel());
        }

        public async Task<PaginatedResult<List<PaymentMethodModel>>> ListPaginatedAsync(SearchPaymentMethodRequest request)
        {
            var userId = GetUserId();

            var paymentMethods = await paymentMethodRepository.ListPaginatedAsync(request, userId);
            var count = await paymentMethodRepository.CountAsync(userId);

            return PaginatedResult<List<PaymentMethodModel>>.Success(paymentMethods.ToModels(), count);
        }

        public async Task<Result<PaymentMethodModel>> CreateAsync(CreatePaymentMethodRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();
            var validationResult = createPaymentMethodValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<PaymentMethodModel>.Failure(errors);
            }

            var paymentMethod = request.ToEntity();
            paymentMethod.Id = Guid.NewGuid();
            paymentMethod.CreatedAt = DateTimeOffset.UtcNow;
            paymentMethod.UpdatedAt = DateTimeOffset.UtcNow;

            paymentMethodRepository.Create(paymentMethod);
            await paymentMethodRepository.SaveChangesAsync();

            return Result<PaymentMethodModel>.Success(paymentMethod.ToModel());
        }

        public async Task<Result<PaymentMethodModel>> UpdateAsync(UpdatePaymentMethodRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            var validationResult = updatePaymentMethodValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<PaymentMethodModel>.Failure(errors);
            }

            var paymentMethod = await paymentMethodRepository.GetByIdAsync(request.Id);
            paymentMethod.UpdatedAt = DateTimeOffset.UtcNow;
            paymentMethod.Description = request.Description;

            paymentMethodRepository.Update(paymentMethod);
            await paymentMethodRepository.SaveChangesAsync();

            return Result<PaymentMethodModel>.Success(paymentMethod.ToModel());
        }

        public async Task<Result<PaymentMethodModel>> DeleteAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<PaymentMethodModel>.Failure(errors);
            }

            var paymentMethod = await paymentMethodRepository.GetByIdAsync(id);

            if (paymentMethod == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<PaymentMethodModel>.Failure(errors);
            }

            paymentMethodRepository.Delete(paymentMethod);
            await paymentMethodRepository.SaveChangesAsync();

            return Result<PaymentMethodModel>.Success(paymentMethod.ToModel());
        }
    }
}
