using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext dbContext)
            : base(dbContext)
        {
        }

        public async Task<int> CountAsync(Guid userId)
        {
            return await DbContext.Categories
                .Where(c => c.UserId == userId)
                .CountAsync();
        }
    }
}
