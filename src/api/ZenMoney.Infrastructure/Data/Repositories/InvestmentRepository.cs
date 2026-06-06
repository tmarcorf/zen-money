using Microsoft.EntityFrameworkCore;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class InvestmentRepository : BaseRepository<Investment>, IInvestmentRepository
    {
        public InvestmentRepository(ApplicationDbContext dbContext)
            : base(dbContext)
        {
        }

        public async Task<List<Investment>> ListPaginatedAsync(SearchInvestmentRequest request, Guid userId)
        {
            var query = GetSearchQuery(request, userId);

            query = query
                .Skip(request.Offset)
                .Take(request.Take);

            return await query.ToListAsync();
        }

        public async Task<int> CountPaginatedAsync(SearchInvestmentRequest request, Guid userId)
        {
            var query = GetSearchQuery(request, userId);

            return await query.CountAsync();
        }

        private IQueryable<Investment> GetSearchQuery(SearchInvestmentRequest request, Guid userId)
        {
            var name = request.Name != null ? request.Name.Trim().ToLower() : string.Empty;
            var type = request.Type != null ? request.Type.Trim().ToLower() : string.Empty;

            var query = DbContext.Investments
                .Where(i => i.UserId == userId
                    && i.Name.ToLower().Contains(name)
                    && i.Type.ToLower().Contains(type));

            if (request.StartDate.HasValue)
            {
                query = query.Where(i => i.Date >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(i => i.Date <= request.EndDate.Value);
            }

            if (request.SortField == SortFieldEnum.Name)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(i => i.Name)
                    : query.OrderByDescending(i => i.Name);
            }

            if (request.SortField == SortFieldEnum.Type)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(i => i.Type)
                    : query.OrderByDescending(i => i.Type);
            }

            if (request.SortField == SortFieldEnum.Date)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(i => i.Date)
                    : query.OrderByDescending(i => i.Date);
            }

            if (request.SortField == SortFieldEnum.Amount)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(i => i.InvestedAmount)
                    : query.OrderByDescending(i => i.InvestedAmount);
            }

            return query.AsNoTracking();
        }
    }
}
