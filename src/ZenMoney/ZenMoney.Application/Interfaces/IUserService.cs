using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.User;
using ZenMoney.Application.Results;

namespace ZenMoney.Application.Interfaces
{
    public interface IUserService
    {
        Task<Result<UserModel>> GetByIdAsync(Guid id);

        Task<Result<UserModel>> CreateAsync(CreateUserRequest request);

        Task<Result<UserModel>> UpdateAsync(UpdateUserRequest request);

        Task<Result<TokenModel>> AuthenticateAsync(AuthUserRequest request);
    }
}
