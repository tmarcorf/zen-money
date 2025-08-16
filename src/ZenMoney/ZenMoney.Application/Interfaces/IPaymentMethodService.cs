using ZenMoney.Application.Models.PaymentMethod;
using ZenMoney.Application.Requests.PaymentMethod;
using ZenMoney.Application.Results;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Interfaces
{
    public interface IPaymentMethodService
    {
        Task<Result<PaymentMethodModel>> GetByIdAsync(Guid id);

        Task<PaginatedResult<List<PaymentMethodModel>>> ListPaginatedAsync(SearchPaymentMethodRequest request);

        Task<Result<List<PaymentMethodModel>>> ListByDescriptionAsync(string description);

        Task<Result<PaymentMethodModel>> CreateAsync(CreatePaymentMethodRequest request);

        Task<Result<PaymentMethodModel>> UpdateAsync(UpdatePaymentMethodRequest request);

        Task<Result<PaymentMethodModel>> DeleteAsync(Guid id);
    }
}
