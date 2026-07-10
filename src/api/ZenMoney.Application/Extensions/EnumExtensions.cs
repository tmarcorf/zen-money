using System.ComponentModel;
using System.Reflection;
using ZenMoney.Application.Results;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Extensions;

public static class EnumExtensions
{
    public static Error ToError(this ErrorCodes errorCode)
    {
        FieldInfo fieldInfo = errorCode.GetType().GetField(errorCode.ToString());

        if (fieldInfo.GetCustomAttributes(typeof(DescriptionAttribute), false) is DescriptionAttribute[] attributes && attributes.Any())
        {
            return new Error(errorCode.ToString(), attributes.First().Description);
        }

        return new Error(errorCode.ToString(), "Erro desconhecido");
    }
}
