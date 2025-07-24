using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
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

        public async Task<IEnumerable<T>> GetAllAsync(int skip, int take)
        {
            var query = dbContext.Set<T>().AsQueryable();

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
    }
}
