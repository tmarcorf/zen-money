using ZenMoney.Core.Entities;
using ZenMoney.Core.Search;

namespace ZenMoney.Core.Interfaces
{
    public interface IPaymentMethodRepository : IBaseRepository<PaymentMethod>
    {
        Task<List<PaymentMethod>> ListPaginatedAsync(SearchPaymentMethodRequest request, Guid userId);
    }
}
