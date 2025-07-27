namespace ZenMoney.Application.Results
{
    public class Error
    {
        public Error(string code, string description)
        {
            Code = code;
            Message = description;
        }

        public string Code { get; set; }

        public string Message { get; set; }

        public static readonly Error None = new(string.Empty, string.Empty);
    }
}
