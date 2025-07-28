using FluentValidation;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.PaymentMethod;
using ZenMoney.Application.Requests.PaymentMethod;
using ZenMoney.Application.Results;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Services
{
    public class PaymentMethodService(
        IPaymentMethodRepository paymentMethodRepository,
        IValidator<CreatePaymentMethodRequest> createPaymentMethodValidator,
        IValidator<UpdatePaymentMethodRequest> updatePaymentMethodValidator) : IPaymentMethodService
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

        public async Task<Result<PaymentMethodModel>> CreateAsync(CreatePaymentMethodRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            var validationResult = createPaymentMethodValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<PaymentMethodModel>.Failure(errors);
            }

            var paymentMethod = request.ToEntity();
            paymentMethod.Id = Guid.NewGuid();
            paymentMethod.CreatedAt = DateTimeOffset.UtcNow;

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

            paymentMethod.Update(request);
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
