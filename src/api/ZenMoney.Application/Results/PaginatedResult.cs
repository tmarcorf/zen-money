using ZenMoney.Application.Extensions;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Results
{
    public class PaginatedResult<T> : Result<T>
    {
        private PaginatedResult(T data, Error error, int totalCount)
            : base(data, error)
        {
            TotalCount = totalCount;
        }

        public int TotalCount { get; }

        public static PaginatedResult<T> Success(T data, int totalCount)
        {
            return new PaginatedResult<T>(data, null, totalCount);
        }

        public static PaginatedResult<T> Failure(ErrorCodes error, int totalCount = 0)
        {
            return new PaginatedResult<T>(default, error.ToError(), totalCount);
        }
    }
}
