using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class BaseRepository<T>(ApplicationDbContext dbContext) : IBaseRepository<T> where T : BaseEntity
    {
        public async Task<T> GetByIdAsync(Guid id)
        {
            var query = dbContext.Set<T>().AsQueryable();

            return await query.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter, int skip, int take)
        {
            var query = dbContext
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
            var query = dbContext.Set<T>().AsQueryable();

            return await query.AnyAsync(filter);
        }

        public T Create(T entity)
        {
            dbContext.Set<T>().Add(entity);

            return entity;
        }

        public T Update(T entity)
        {
            dbContext.Set<T>().Update(entity);

            return entity;
        }

        public T Delete(T entity)
        {
            dbContext.Set<T>().Remove(entity);

            return entity;
        }

        public async Task<int> TotalCountAsync()
        {
            return await dbContext.Set<T>().CountAsync();
        }

        public async Task SaveChangesAsync()
        {
            await dbContext.SaveChangesAsync();
        }
    }
}
