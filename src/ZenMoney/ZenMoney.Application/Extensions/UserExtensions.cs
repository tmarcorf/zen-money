using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.User;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Extensions
{
    public static class UserExtensions
    {
        public static UserModel ToModel(this User user)
        {
            return new UserModel
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth
            };
        }

        public static User ToEntity(this UserModel user)
        {
            return new User
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                DateOfBirth = user.DateOfBirth
            };
        }

        public static User ToEntity(this CreateUserRequest request)
        {
            return new User
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth
            };
        }

        public static User ToEntity(this UpdateUserRequest request)
        {
            return new User
            {
                Id = request.Id,
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth
            };
        }

        public static void Update(this User user, UpdateUserRequest request)
        {
            user.Email = request.Email;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.DateOfBirth = request.DateOfBirth;
        }
    }
}
