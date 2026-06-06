using ZenMoney.Core.Entities;
using ZenMoney.Core.Search;

namespace ZenMoney.Core.Interfaces
{
    public interface IInvestmentRepository : IBaseRepository<Investment>
    {
        Task<List<Investment>> ListPaginatedAsync(SearchInvestmentRequest request, Guid userId);

        Task<int> CountPaginatedAsync(SearchInvestmentRequest request, Guid userId);
    }
}
