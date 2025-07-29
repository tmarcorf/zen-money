using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.User;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Services
{
    public class UserService(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IValidator<CreateUserRequest> createUserValidator,
        IValidator<UpdateUserRequest> updateUserValidator,
        IConfiguration configuration) : IUserService
    {
        public async Task<Result<UserModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<UserModel>.Failure(errors);
            }

            var user = await userManager.FindByIdAsync(id.ToString());

            return Result<UserModel>.Success(user.ToModel());
        }

        public async Task<Result<UserModel>> CreateAsync(CreateUserRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            var validationResult = createUserValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<UserModel>.Failure(errors);
            }

            var user = request.ToEntity();
            user.Id = Guid.NewGuid();

            await userManager.CreateAsync(user, request.Password);

            return Result<UserModel>.Success(user.ToModel());
        }

        public async Task<Result<UserModel>> UpdateAsync(UpdateUserRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            var validationResult = updateUserValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<UserModel>.Failure(errors);
            }

            var user = await userManager.FindByIdAsync(request.Id.ToString());

            user.Update(request);
            await userManager.UpdateAsync(user);

            return Result<UserModel>.Success(user.ToModel());
        }

        public async Task<Result<TokenModel>> AuthenticateAsync(AuthUserRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            var result = await signInManager.PasswordSignInAsync(request.Email, request.Password, false, false);

            if (!result.Succeeded)
            {
                var errors = ErrorHelper.GetInvalidEmailOrPasswordError();

                return Result<TokenModel>.Failure(errors);
            }

            var user = await userManager.FindByEmailAsync(request.Email);

            return GenerateToken(user);
        }

        #region PRIVATE METHODS

        private Result<TokenModel> GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim("sub", user.Id.ToString()),
                new Claim("email", user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var privateKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    Environment.GetEnvironmentVariable(
                        configuration["Jwt:SecretKey"])));

            var credentials = new SigningCredentials(privateKey, SecurityAlgorithms.HmacSha512);
            var expiration = DateTime.UtcNow.AddHours(2);

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: expiration,
                signingCredentials: credentials
                );

            var userTokenDto = new TokenModel
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = expiration
            };

            return Result<TokenModel>.Success(userTokenDto);
        }

        #endregion
    }
}
