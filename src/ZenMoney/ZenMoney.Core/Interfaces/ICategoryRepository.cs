using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Search;

namespace ZenMoney.Core.Interfaces
{
    public interface ICategoryRepository : IBaseRepository<Category>
    {
        Task<int> CountAsync(Guid userId);

        Task<List<Category>> ListPaginatedAsync(SearchCategoryRequest request, Guid userId);
    }
}
