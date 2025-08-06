using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class ExpenseRepository : BaseRepository<Expense>, IExpenseRepository
    {
        public ExpenseRepository(ApplicationDbContext dbContext) 
            : base(dbContext)
        {
        }
    }
}
