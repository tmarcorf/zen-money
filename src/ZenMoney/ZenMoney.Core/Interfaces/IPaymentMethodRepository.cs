using ZenMoney.Core.Entities;
using ZenMoney.Core.Search;

namespace ZenMoney.Core.Interfaces
{
    public interface IPaymentMethodRepository : IBaseRepository<PaymentMethod>
    {
        Task<List<PaymentMethod>> ListPaginatedAsync(SearchPaymentMethodRequest request, Guid userId);

        Task<List<PaymentMethod>> ListByDescriptionAsync(string description, Guid userId);

        Task<bool> IsBeingUsed(Guid paymentMethodId, Guid userId);
    }
}
