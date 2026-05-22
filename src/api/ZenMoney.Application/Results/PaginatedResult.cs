using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Application.Results
{
    public class PaginatedResult<T> : Result<T>
    {
        private PaginatedResult(T data, List<Error> errors, int totalCount)
            : base(data, errors) 
        {
            TotalCount = totalCount;
        }

        public int TotalCount { get; }

        public static PaginatedResult<T> Success(T data, int totalCount)
        {
            return new PaginatedResult<T>(data, null, totalCount);
        }

        public static PaginatedResult<T> Failure(List<Error> errors, int totalCount)
        {
            return new PaginatedResult<T>(default, errors, totalCount);
        }
    }
}
