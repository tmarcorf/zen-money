using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class BaseRepository<T> : IBaseRepository<T> where T : BaseEntity
    {
        protected readonly ApplicationDbContext DbContext;

        public BaseRepository(ApplicationDbContext dbContext)
        {
            DbContext = dbContext;
        }

        public async Task<T> GetByIdAsync(Guid id)
        {
            var query = DbContext.Set<T>().AsQueryable();

            return await query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter, int skip, int take)
        {
            var query = DbContext
                .Set<T>()
                .Where(filter)
                .AsQueryable();

            query = query
                .Skip(skip)
                .Take(take);

            return await query.ToArrayAsync();
        }

        public async Task<bool> ExistsAsync(Expression<Func<T, bool>> filter)
        {
            var query = DbContext.Set<T>().AsQueryable();

            return await query.AnyAsync(filter);
        }

        public T Create(T entity)
        {
            DbContext.Set<T>().Add(entity);

            return entity;
        }

        public T Update(T entity)
        {
            DbContext.Set<T>().Update(entity);

            return entity;
        }

        public T Delete(T entity)
        {
            DbContext.Set<T>().Remove(entity);

            return entity;
        }

        public async Task<int> CountAsync(Guid userId)
        {
            return await DbContext
                .Set<T>()
                .Where(x => x.UserId == userId)
                .CountAsync();
        }

        public async Task SaveChangesAsync()
        {
            await DbContext.SaveChangesAsync();
        }
    }
}
