using ZenMoney.Core.Entities;
using ZenMoney.Core.Search;

namespace ZenMoney.Core.Interfaces
{
    public interface IIncomeRepository : IBaseRepository<Income>
    {
        Task<List<Income>> ListPaginatedAsync(SearchIncomeRequest request, Guid userId);

        Task<int> CountPaginatedAsync(SearchIncomeRequest request, Guid userId);

        Task<decimal> GetTotalAmoutByMonth(int month, int year, Guid userId);
    }
}
