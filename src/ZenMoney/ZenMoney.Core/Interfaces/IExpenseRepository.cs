using ZenMoney.Core.Dashboard;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Search;

namespace ZenMoney.Core.Interfaces
{
    public interface IExpenseRepository : IBaseRepository<Expense>
    {
        Task<List<Expense>> ListPaginatedAsync(SearchExpenseRequest request, Guid userId);

        Task<int> CountPaginatedAsync(SearchExpenseRequest request, Guid userId);

        Task<decimal> GetTotalAmoutByMonth(int month, int year, Guid userId);

        Task<List<ExpensesByCategoryModel>> GetExpensesByCategoryByMonth(int month, int year, Guid userId);

        Task<List<ExpensesByPaymentMethodModel>> GetExpensesByPaymentMethodByMonth(int month, int year, Guid userId);
    }
}
