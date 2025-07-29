namespace ZenMoney.Application.Results
{
    public class Result<T>
    {
        private Result(T data, List<Error> errors)
        {
            Data = data;
            IsSuccess = errors == null || errors.Count == 0;
            Errors = errors;
        }

        public T Data { get; }

        public bool IsSuccess { get; }

        public List<Error> Errors { get; }

        public static Result<T> Success(T data)
        {
            return new Result<T>(data, null);
        }

        public static Result<T> Failure(List<Error> errors)
        {
            return new Result<T>(default, errors);
        }
    }
}
