using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.User;

namespace ZenMoney.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserModel> GetByIdAsync(Guid id);

        Task<UserModel> CreateAsync(CreateUserRequest request);
    }
}
