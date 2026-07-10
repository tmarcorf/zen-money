using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.PaymentMethod;
using ZenMoney.Application.Requests.PaymentMethod;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Services
{
    public class PaymentMethodService(
        IPaymentMethodRepository paymentMethodRepository,
        IHttpContextAccessor httpContextAcessor) : BaseService(httpContextAcessor), IPaymentMethodService
    {
        public async Task<Result<PaymentMethodModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                return Result<PaymentMethodModel>.Failure(ErrorCodes.InvalidId);
            }

            var paymentMethod = await paymentMethodRepository.GetByIdAsync(id);

            if (paymentMethod == null)
            {
                return Result<PaymentMethodModel>.Failure(ErrorCodes.PaymentMethodNotFound);
            }

            return Result<PaymentMethodModel>.Success(paymentMethod.ToModel());
        }

        public async Task<PaginatedResult<List<PaymentMethodModel>>> ListPaginatedAsync(SearchPaymentMethodRequest request)
        {
            var userId = GetUserId();

            var paymentMethods = await paymentMethodRepository.ListPaginatedAsync(request, userId);
            var count = await paymentMethodRepository.CountPaginatedAsync(request, userId);

            return PaginatedResult<List<PaymentMethodModel>>.Success(paymentMethods.ToModels(), count);
        }

        public async Task<Result<List<PaymentMethodModel>>> ListByDescriptionAsync(string description)
        {
            var userId = GetUserId();

            var paymentMethods = await paymentMethodRepository.ListByDescriptionAsync(description, userId);

            return Result<List<PaymentMethodModel>>.Success(paymentMethods.ToModels());
        }

        public async Task<Result<PaymentMethodModel>> CreateAsync(CreatePaymentMethodRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();

            var validationError = await ValidateCreateAsync(request);
            if (validationError.HasValue)
                return Result<PaymentMethodModel>.Failure(validationError.Value);

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
            ArgumentNullException.ThrowIfNull(request);

            var validationError = await ValidateUpdateAsync(request);
            if (validationError.HasValue)
                return Result<PaymentMethodModel>.Failure(validationError.Value);

            var paymentMethod = await paymentMethodRepository.GetByIdAsync(request.Id);
            paymentMethod.UpdatedAt = DateTimeOffset.UtcNow;
            paymentMethod.Description = request.Description;

            await paymentMethodRepository.UpdateEntityAsync(paymentMethod);

            return Result<PaymentMethodModel>.Success(paymentMethod.ToModel());
        }

        public async Task<Result<PaymentMethodModel>> DeleteAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                return Result<PaymentMethodModel>.Failure(ErrorCodes.InvalidId);
            }

            var paymentMethod = await paymentMethodRepository.GetByIdAsync(id);

            if (paymentMethod == null)
            {
                return Result<PaymentMethodModel>.Failure(ErrorCodes.PaymentMethodNotFound);
            }

            var validationError = await ValidateDeleteAsync(paymentMethod);
            if (validationError.HasValue)
                return Result<PaymentMethodModel>.Failure(validationError.Value);

            paymentMethodRepository.Delete(paymentMethod);
            await paymentMethodRepository.SaveChangesAsync();

            return Result<PaymentMethodModel>.Success(paymentMethod.ToModel());
        }

        #region Private Validation Methods

        private async Task<ErrorCodes?> ValidateCreateAsync(CreatePaymentMethodRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Description))
                return ErrorCodes.PaymentMethodDescriptionEmpty;

            if (request.Description.Length > 50)
                return ErrorCodes.PaymentMethodDescriptionTooLong;

            var exists = await paymentMethodRepository.ExistsAsync(p =>
                p.UserId == request.UserId && p.Description == request.Description);

            if (exists)
                return ErrorCodes.PaymentMethodAlreadyExists;

            return null;
        }

        private async Task<ErrorCodes?> ValidateUpdateAsync(UpdatePaymentMethodRequest request)
        {
            if (request.Id == Guid.Empty)
                return ErrorCodes.InvalidId;

            var entityExists = await paymentMethodRepository.ExistsAsync(x => x.Id == request.Id);
            if (!entityExists)
                return ErrorCodes.PaymentMethodNotFound;

            if (string.IsNullOrWhiteSpace(request.Description))
                return ErrorCodes.PaymentMethodDescriptionEmpty;

            if (request.Description.Length > 50)
                return ErrorCodes.PaymentMethodDescriptionTooLong;

            var duplicateExists = await paymentMethodRepository.ExistsAsync(p =>
                p.Id != request.Id && p.UserId == request.UserId && p.Description == request.Description);

            if (duplicateExists)
                return ErrorCodes.PaymentMethodAlreadyExists;

            return null;
        }

        private async Task<ErrorCodes?> ValidateDeleteAsync(PaymentMethod paymentMethod)
        {
            var isBeingUsed = await paymentMethodRepository.IsBeingUsed(paymentMethod.Id, paymentMethod.UserId);

            if (isBeingUsed)
                return ErrorCodes.PaymentMethodInUse;

            return null;
        }

        #endregion
    }
}
