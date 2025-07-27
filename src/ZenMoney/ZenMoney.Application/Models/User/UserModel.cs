using ZenMoney.Application.Models.Expense;
using ZenMoney.Application.Models.Income;

namespace ZenMoney.Application.Models.User
{
    public class UserModel
    {
        public Guid Id { get; set; }

        public string Email { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public List<IncomeModel> Incomes { get; set; }

        public List<ExpenseModel> Expenses { get; set; }
    }
}
