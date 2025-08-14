using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class IncomeRepository : BaseRepository<Income>, IIncomeRepository
    {
        public IncomeRepository(ApplicationDbContext dbContext)
            : base(dbContext)
        {
        }

        public async Task<List<Income>> ListPaginatedAsync(SearchIncomeRequest request, Guid userId)
        {
            var description = request.Description != null ? request.Description.Trim() : string.Empty;

            var query = DbContext.Incomes
                .Where(i => i.UserId == userId && i.Description.Contains(description));

            if (request.Type.HasValue)
            {
                query = query.Where(i => i.Type == request.Type.Value);
            }

            if (request.StartDate.HasValue)
            {
                query = query.Where(i => i.Date >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(i => i.Date <= request.EndDate.Value);
            }

            if (request.SortField == SortFieldEnum.Type)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(i => i.Type)
                    : query.OrderByDescending(i => i.Type);
            }

            if (request.SortField == SortFieldEnum.Description)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(i => i.Description)
                    : query.OrderByDescending(i => i.Description);
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
                    ? query.OrderBy(i => i.Amount)
                    : query.OrderByDescending(i => i.Amount);
            }

            query = query
                .Skip(request.Offset)
                .Take(request.Take);

            return await query.ToListAsync();
        }
    }
}
