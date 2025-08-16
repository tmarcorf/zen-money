using Azure.Core;
using Microsoft.EntityFrameworkCore;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class CategoryRepository : BaseRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(ApplicationDbContext dbContext)
            : base(dbContext)
        {
        }

        public async Task<List<Category>> ListPaginatedAsync(SearchCategoryRequest request, Guid userId)
        {
            var query = GetSearchQuery(request, userId);

            query = query
                .Skip(request.Offset)
                .Take(request.Take);

            return await query.ToListAsync();
        }

        public async Task<int> CountPaginatedAsync(SearchCategoryRequest request, Guid userId)
        {
            var query = GetSearchQuery(request, userId);

            return await query.CountAsync();
        }

        public async Task<List<Category>> ListByNameAsync(string name, Guid userId)
        {
            var cleanName = !string.IsNullOrWhiteSpace(name) ? name.Trim() : string.Empty;

            var query = DbContext.Categories
                .Where(c => c.UserId == userId && c.Name.Contains(cleanName))
                .OrderBy(c => c.Name);

            return await query.ToListAsync();
        }

        public async Task<bool> IsBeingUsed(Guid categoryId, Guid userId)
        {
            return await DbContext.Expenses.AnyAsync(e => e.UserId == userId && e.CategoryId == categoryId);
        }

        private IQueryable<Category> GetSearchQuery(SearchCategoryRequest request, Guid userId)
        {
            var name = request.Name != null ? request.Name.Trim() : string.Empty;

            var query = DbContext.Categories
                .Where(c => c.UserId == userId && c.Name.Contains(name));

            if (request.SortField == SortFieldEnum.Name)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(c => c.Name)
                    : query.OrderByDescending(c => c.Name);
            }

            if (request.SortField == SortFieldEnum.CreatedAt)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(c => c.CreatedAt)
                    : query.OrderByDescending(c => c.CreatedAt);
            }

            if (request.SortField == SortFieldEnum.UpdatedAt)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(c => c.UpdatedAt)
                    : query.OrderByDescending(c => c.UpdatedAt);
            }

            return query;
        }
    }
}
