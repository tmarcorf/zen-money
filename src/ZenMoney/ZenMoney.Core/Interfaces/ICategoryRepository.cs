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
        Task<List<Category>> ListPaginatedAsync(SearchCategoryRequest request, Guid userId);

        Task<List<Category>> ListByNameAsync(string name, Guid userId);

        Task<bool> IsBeingUsed(Guid categoryId, Guid userId);
    }
}
