using System.Text.Json.Serialization;
using ZenMoney.Application.Results;

namespace ZenMoney.API.Responses
{
    public class ApiResponse<T>
    {
        [JsonPropertyName("code")]
        public string Code { get; private set; }

        [JsonPropertyName("data")]
        public T Data { get; private set; }

        [JsonPropertyName("isSuccess")]
        public bool IsSuccess { get; private set; }

        [JsonPropertyName("errors")]
        public List<Error> Errors { get; private set; }

        [JsonPropertyName("timestamp")]
        public DateTimeOffset Timestamp => DateTimeOffset.UtcNow;

        private ApiResponse(string code, T data, List<Error> errors)
        {
            Code = code;
            Data = data;
            IsSuccess = errors == null || errors.Count == 0;
            Errors = errors;
        }

        public static ApiResponse<T> Success(T data, string code = "200")
        {
            return new ApiResponse<T>(code, data, null);
        }

        public static ApiResponse<T> Failure(List<Error> errors, string code = "400")
        {
            return new ApiResponse<T>(code, default, errors);
        }
    }
}
