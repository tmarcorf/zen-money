using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ZenMoney.Core.Entities
{
    public class User : IdentityUser<Guid>
    {
        [Required]
        [MaxLength(100)]
        public override string Email { get; set; }

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [Required]
        public DateOnly DateOfBirth { get; set; }

        public List<Income> Incomes { get; set; }

        public List<Expense> Expenses { get; set; }
    }
}
