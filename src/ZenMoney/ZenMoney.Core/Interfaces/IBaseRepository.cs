using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Core.Interfaces
{
    public interface IBaseRepository<T>
    {
        Task<T> GetByIdAsync(Guid id);

        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter, int skip, int take);

        Task<bool> ExistsAsync(Expression<Func<T, bool>> filter);

        T Create(T entity);

        T Update(T entity);

        T Delete(T entity);

        Task<int> TotalCountAsync();

        Task SaveChangesAsync();
    }
}
