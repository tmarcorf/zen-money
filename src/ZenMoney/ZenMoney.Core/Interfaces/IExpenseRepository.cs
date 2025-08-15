using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Search;

namespace ZenMoney.Core.Interfaces
{
    public interface IExpenseRepository : IBaseRepository<Expense>
    {
        Task<List<Expense>> ListPaginatedAsync(SearchExpenseRequest request, Guid userId);
    }
}
