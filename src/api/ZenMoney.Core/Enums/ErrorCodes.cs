using System.ComponentModel;

namespace ZenMoney.Core.Enums;

public enum ErrorCodes
{
    // Category
    [Description("O nome da categoria está vazio")]
    CategoryNameEmpty = 1,
    [Description("O tamanho máximo do nome é de 50 caracteres")]
    CategoryNameTooLong,
    [Description("Já existe uma categoria cadastrada com este nome")]
    CategoryAlreadyExists,
    [Description("A categoria informada não foi encontrada")]
    CategoryNotFound,
    [Description("Não é possível remover a categoria pois está vinculada a um gasto")]
    CategoryInUse,

    // Expense
    [Description("O tipo é obrigatório")]
    ExpenseTypeEmpty,
    [Description("O tipo está inválido")]
    ExpenseTypeInvalid,
    [Description("A data é obrigatória")]
    ExpenseDateEmpty,
    [Description("A data está inválida")]
    ExpenseDateInvalid,
    [Description("A descrição é obrigatória")]
    ExpenseDescriptionEmpty,
    [Description("O tamanho máximo para a descrição é de 100 caracteres")]
    ExpenseDescriptionTooLong,
    [Description("O valor é obrigatório")]
    ExpenseAmountEmpty,
    [Description("O valor não pode estar zerado")]
    ExpenseAmountInvalid,
    [Description("A categoria do gasto é obrigatória")]
    ExpenseCategoryIdEmpty,
    [Description("A categoria informada não existe")]
    ExpenseCategoryNotFound,
    [Description("A forma de pagamento do gasto é obrigatória")]
    ExpensePaymentMethodIdEmpty,
    [Description("A forma de pagamento informada não existe")]
    ExpensePaymentMethodNotFound,
    [Description("O gasto não existe")]
    ExpenseNotFound,

    // Income
    [Description("O tipo da entrada é obrigatório")]
    IncomeTypeEmpty,
    [Description("O tipo da entrada está inválido")]
    IncomeTypeInvalid,
    [Description("A data da entrada está inválida")]
    IncomeDateInvalid,
    [Description("A descrição é obrigatória")]
    IncomeDescriptionEmpty,
    [Description("A descrição deve ter pelo menos 3 caracteres")]
    IncomeDescriptionTooShort,
    [Description("A descrição deve ter no máximo 100 caracteres")]
    IncomeDescriptionTooLong,
    [Description("O valor da entrada é obrigatório")]
    IncomeAmountEmpty,
    [Description("A entrada não existe")]
    IncomeNotFound,

    // PaymentMethod
    [Description("A descrição é obrigatória")]
    PaymentMethodDescriptionEmpty,
    [Description("O tamanho máximo da descrição é de 50 caracteres")]
    PaymentMethodDescriptionTooLong,
    [Description("Já existe um método de pagamento cadastrado com este nome")]
    PaymentMethodAlreadyExists,
    [Description("O método de pagamento não existe")]
    PaymentMethodNotFound,
    [Description("Não é possível remover a forma de pagamento pois está vinculada a um gasto")]
    PaymentMethodInUse,

    // Investment
    [Description("O nome do investimento é obrigatório")]
    InvestmentNameEmpty,
    [Description("O nome deve ter pelo menos 3 caracteres")]
    InvestmentNameTooShort,
    [Description("O nome deve ter no máximo 100 caracteres")]
    InvestmentNameTooLong,
    [Description("O tipo do investimento é obrigatório")]
    InvestmentTypeEmpty,
    [Description("O tipo deve ter no máximo 50 caracteres")]
    InvestmentTypeTooLong,
    [Description("O valor investido deve ser maior que zero")]
    InvestmentAmountInvalid,
    [Description("O valor atual não pode ser negativo")]
    InvestmentCurrentValueNegative,
    [Description("A data do investimento está inválida")]
    InvestmentDateInvalid,
    [Description("As observações devem ter no máximo 500 caracteres")]
    InvestmentNotesTooLong,
    [Description("O investimento não existe")]
    InvestmentNotFound,

    // User
    [Description("O e-mail é obrigatório")]
    EmailEmpty,
    [Description("O e-mail informado é inválido")]
    EmailInvalid,
    [Description("O e-mail deve ter no máximo 512 caracteres")]
    EmailTooLong,
    [Description("O e-mail informado já existe")]
    EmailAlreadyExists,
    [Description("A senha é obrigatória")]
    PasswordEmpty,
    [Description("A senha precisa ter pelo menos uma letra maiúscula, minúscula, caracter especial e número")]
    PasswordInvalidFormat,
    [Description("O primeiro nome é obrigatório")]
    FirstNameEmpty,
    [Description("O primeiro nome deve ter no máximo 100 caracteres")]
    FirstNameTooLong,
    [Description("O último nome é obrigatório")]
    LastNameEmpty,
    [Description("O último nome deve ter no máximo 100 caracteres")]
    LastNameTooLong,
    [Description("A data de nascimento é obrigatória")]
    DateOfBirthEmpty,
    [Description("A data de nascimento não pode ser maior que a data atual")]
    DateOfBirthInFuture,
    [Description("O usuário não foi encontrado")]
    UserNotFound,
    [Description("Sessão inválida")]
    InvalidSession,

    // General
    [Description("O identificador informado é inválido")]
    InvalidId,
    [Description("O mês ou ano informado é inválido")]
    InvalidMonthOrYear,
    [Description("O e-mail ou senha estão incorretos")]
    InvalidEmailOrPassword,
}
