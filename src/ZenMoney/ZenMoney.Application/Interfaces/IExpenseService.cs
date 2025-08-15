using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Requests.Expense;
using ZenMoney.Application.Results;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Interfaces
{
    public interface IExpenseService
    {
        Task<Result<ExpenseModel>> GetByIdAsync(Guid id);

        Task<PaginatedResult<List<ExpenseModel>>> ListPaginatedAsync(SearchExpenseRequest request);

        Task<Result<ExpenseModel>> CreateAsync(CreateExpenseRequest request);

        Task<Result<ExpenseModel>> UpdateAsync(UpdateExpenseRequest request);

        Task<Result<ExpenseModel>> DeleteAsync(Guid id);
    }
}
