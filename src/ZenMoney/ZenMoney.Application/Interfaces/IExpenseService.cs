using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Requests.Expense;
using ZenMoney.Application.Results;

namespace ZenMoney.Application.Interfaces
{
    public interface IExpenseService
    {
        Task<Result<ExpenseModel>> GetByIdAsync(Guid id);

        Task<Result<ExpenseModel>> CreateAsync(CreateExpenseRequest request);

        Task<Result<ExpenseModel>> UpdateAsync(UpdateExpenseRequest request);

        Task<Result<ExpenseModel>> DeleteAsync(Guid id);
    }
}
