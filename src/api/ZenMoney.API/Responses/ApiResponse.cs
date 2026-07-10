using System.Text.Json.Serialization;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Results;
using ZenMoney.Core.Enums;

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

        [JsonPropertyName("error")]
        public Error? Error { get; private set; }

        [JsonPropertyName("totalCount")]
        public int TotalCount { get; set; }

        [JsonPropertyName("timestamp")]
        public DateTimeOffset Timestamp => DateTimeOffset.UtcNow;

        private ApiResponse(string code, T data, Error? error, int totalCount = 0)
        {
            Code = code;
            Data = data;
            IsSuccess = error == null;
            Error = error;
            TotalCount = totalCount;
        }

        public static ApiResponse<T> Success(T data, string code = "200", int totalCount = 0)
        {
            return new ApiResponse<T>(code, data, null, totalCount);
        }

        public static ApiResponse<T> Failure(Error error, string code = "400", int totalCount = 0)
        {
            return new ApiResponse<T>(code, default!, error, totalCount);
        }

        public static ApiResponse<T> Failure(ErrorCodes errorCode, string code = "400", int totalCount = 0)
        {
            return new ApiResponse<T>(code, default!, errorCode.ToError(), totalCount);
        }
    }
}
