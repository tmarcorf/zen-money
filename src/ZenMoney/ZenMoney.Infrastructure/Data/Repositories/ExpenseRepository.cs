using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class ExpenseRepository : BaseRepository<Expense>, IExpenseRepository
    {
        public ExpenseRepository(ApplicationDbContext dbContext) 
            : base(dbContext)
        {
        }

        public async Task<List<Expense>> ListPaginatedAsync(SearchExpenseRequest request, Guid userId)
        {
            var description = request.Description != null ? request.Description.Trim() : string.Empty;

            var query = DbContext.Expenses
                .Include(e => e.Category)
                .Include(e => e.PaymentMethod)
                .Where(e => e.UserId == userId && e.Description.Contains(description));

            if (request.Type.HasValue)
            {
                query = query.Where(e => e.Type == request.Type.Value);
            }

            if (request.StartDate.HasValue)
            {
                query = query.Where(e => e.Date >= request.StartDate.Value);
            }

            if (request.EndDate.HasValue)
            {
                query = query.Where(e => e.Date <= request.EndDate.Value);
            }

            if (request.SortField == SortFieldEnum.Type)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(e => e.Type)
                    : query.OrderByDescending(e => e.Type);
            }

            if (request.SortField == SortFieldEnum.Category)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(e => e.Category.Name)
                    : query.OrderByDescending(e => e.Category.Name);
            }

            if (request.SortField == SortFieldEnum.Description)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(e => e.Description)
                    : query.OrderByDescending(e => e.Description);
            }

            if (request.SortField == SortFieldEnum.Date)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(e => e.Date)
                    : query.OrderByDescending(e => e.Date);
            }

            if (request.SortField == SortFieldEnum.PaymentMethod)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(e => e.PaymentMethod.Description)
                    : query.OrderByDescending(e => e.PaymentMethod.Description);
            }

            if (request.SortField == SortFieldEnum.Amount)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(e => e.Amount)
                    : query.OrderByDescending(e => e.Amount);
            }

            if (request.SortField == SortFieldEnum.IsPaid)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(e => e.IsPaid)
                    : query.OrderByDescending(e => e.IsPaid);
            }

            query = query
                .Skip(request.Offset)
                .Take(request.Take);

            return await query.ToListAsync();
        }
    }
}
