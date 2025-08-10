using FluentValidation.Results;
using ZenMoney.Application.Results;

namespace ZenMoney.Application.Helpers
{
    public class ErrorHelper
    {
        public static List<Error> GetErrors(ValidationResult validationResult)
        {
            if (validationResult == null || validationResult.IsValid) return new List<Error>();

            var errors = validationResult.Errors.Select(x => new Error(x.PropertyName, x.ErrorMessage));

            return errors.ToList();
        }

        public static List<Error> GetInvalidParameterError(string paramName, string paramValue)
        {
            return new List<Error>
            {
                new Error(paramName, $"O valor {paramValue} é inválido")
            };
        }

        public static List<Error> GetInvalidEmailOrPasswordError()
        {
            return new List<Error>
            {
                new Error("Email / Password", "O e-mail ou senha estão incorretos")
            };
        }
    }
}
