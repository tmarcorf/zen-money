using ZenMoney.Application.Extensions;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Results
{
    public class Result<T>
    {
        protected Result(T data, Error error)
        {
            Data = data;
            IsSuccess = error == null;
            Error = error;
        }

        public T Data { get; }

        public bool IsSuccess { get; }

        public Error Error { get; }

        public static Result<T> Success(T data)
        {
            return new Result<T>(data, null);
        }
        
        public static Result<T> Failure(ErrorCodes error)
        {
            return new Result<T>(default, error.ToError());
        }
    }
}
