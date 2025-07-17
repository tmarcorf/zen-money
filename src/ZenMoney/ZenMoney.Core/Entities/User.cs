using Microsoft.AspNetCore.Identity;

namespace ZenMoney.Core.Entities
{
    public class User : IdentityUser<Guid>
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public DateOnly DateOfBirth { get; set; }

        public List<Income> Incomes { get; set; }

        public List<Expense> Expenses { get; set; }
    }
}
