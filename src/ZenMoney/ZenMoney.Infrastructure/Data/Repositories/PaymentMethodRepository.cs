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
    public class PaymentMethodRepository : BaseRepository<PaymentMethod>, IPaymentMethodRepository
    {
        public PaymentMethodRepository(ApplicationDbContext dbContext)
            : base(dbContext)
        {
        }

        public async Task<List<PaymentMethod>> ListPaginatedAsync(SearchPaymentMethodRequest request, Guid userId)
        {
            var query = GetSearchQuery(request, userId);

            query = query
                .Skip(request.Offset)
                .Take(request.Take);

            return await query.ToListAsync();
        }

        public async Task<int> CountPaginatedAsync(SearchPaymentMethodRequest request, Guid userId)
        {
            var query = GetSearchQuery(request, userId);

            return await query.CountAsync();
        }

        public async Task<List<PaymentMethod>> ListByDescriptionAsync(string description, Guid userId)
        {
            var cleanDescription = !string.IsNullOrWhiteSpace(description) ? description.Trim() : string.Empty;

            var query = DbContext.PaymentMethods
                .Where(p => p.UserId == userId && p.Description.Contains(cleanDescription))
                .OrderBy(p => p.Description);

            return await query.ToListAsync();
        }

        public async Task<bool> IsBeingUsed(Guid paymentMethodId, Guid userId)
        {
            return await DbContext.Expenses.AnyAsync(e => e.UserId == userId && e.PaymentMethodId == paymentMethodId);
        }

        private IQueryable<PaymentMethod> GetSearchQuery(SearchPaymentMethodRequest request, Guid userId)
        {
            var description = request.Description != null ? request.Description.Trim() : string.Empty;

            var query = DbContext.PaymentMethods
                .Where(p => p.UserId == userId && p.Description.Contains(description));

            if (request.SortField == SortFieldEnum.Description)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(p => p.Description)
                    : query.OrderByDescending(p => p.Description);
            }

            if (request.SortField == SortFieldEnum.CreatedAt)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(p => p.CreatedAt)
                    : query.OrderByDescending(p => p.CreatedAt);
            }

            if (request.SortField == SortFieldEnum.UpdatedAt)
            {
                query = request.SortDirection == SortDirectionEnum.Asc
                    ? query.OrderBy(p => p.UpdatedAt)
                    : query.OrderByDescending(p => p.UpdatedAt);
            }

            return query;
        }
    }
}
