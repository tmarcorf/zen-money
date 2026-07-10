using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.User;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;

namespace ZenMoney.Application.Services
{
    public class UserService(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        IConfiguration configuration) : IUserService
    {
        public async Task<Result<UserModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                return Result<UserModel>.Failure(ErrorCodes.InvalidId);
            }

            var user = await userManager.FindByIdAsync(id.ToString());

            return Result<UserModel>.Success(user.ToModel());
        }

        public async Task<Result<UserModel>> CreateAsync(CreateUserRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var validationError = await ValidateCreateAsync(request);
            if (validationError.HasValue)
                return Result<UserModel>.Failure(validationError.Value);

            var user = request.ToEntity();
            user.Id = Guid.NewGuid();

            await userManager.CreateAsync(user, request.Password);

            return Result<UserModel>.Success(user.ToModel());
        }

        public async Task<Result<UserModel>> UpdateAsync(UpdateUserRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var validationError = await ValidateUpdateAsync(request);
            if (validationError.HasValue)
                return Result<UserModel>.Failure(validationError.Value);

            var user = await userManager.FindByIdAsync(request.Id.ToString());

            user.Update(request);
            await userManager.UpdateAsync(user);

            return Result<UserModel>.Success(user.ToModel());
        }

        public async Task<Result<TokenModel>> AuthenticateAsync(AuthUserRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var validationError = ValidateAuthenticate(request);
            if (validationError.HasValue)
                return Result<TokenModel>.Failure(validationError.Value);

            var result = await signInManager.PasswordSignInAsync(request.Email, request.Password, false, false);

            if (!result.Succeeded)
            {
                return Result<TokenModel>.Failure(ErrorCodes.InvalidEmailOrPassword);
            }

            var user = await userManager.FindByEmailAsync(request.Email);

            return GenerateToken(user);
        }

        public async Task SignOutAsync()
        {
            await signInManager.SignOutAsync();
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
                    configuration["Jwt:SecretKey"]));

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
                FirstName = user.FirstName,
                Email = user.Email,
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = expiration
            };

            return Result<TokenModel>.Success(userTokenDto);
        }

        #endregion

        #region Private Validation Methods

        private async Task<ErrorCodes?> ValidateCreateAsync(CreateUserRequest request)
        {
            var baseError = await ValidateBaseUserAsync(request);
            if (baseError.HasValue)
                return baseError;

            var emailExists = await userManager.FindByEmailAsync(request.Email);
            if (emailExists != null)
                return ErrorCodes.EmailAlreadyExists;

            return null;
        }

        private async Task<ErrorCodes?> ValidateUpdateAsync(UpdateUserRequest request)
        {
            if (request.Id == Guid.Empty)
                return ErrorCodes.InvalidId;

            var user = await userManager.FindByIdAsync(request.Id.ToString());
            if (user == null)
                return ErrorCodes.UserNotFound;

            var baseError = await ValidateBaseUserAsync(request);
            if (baseError.HasValue)
                return baseError;

            return null;
        }

        private Task<ErrorCodes?> ValidateBaseUserAsync(BaseUserRequest request)
        {
            return Task.FromResult(ValidateBaseUser(request));
        }

        private static ErrorCodes? ValidateBaseUser(BaseUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return ErrorCodes.EmailEmpty;

            if (!EmailIsValid(request.Email))
                return ErrorCodes.EmailInvalid;

            if (request.Email.Length > 512)
                return ErrorCodes.EmailTooLong;

            if (string.IsNullOrWhiteSpace(request.Password))
                return ErrorCodes.PasswordEmpty;

            if (!PasswordIsValid(request.Password))
                return ErrorCodes.PasswordInvalidFormat;

            if (string.IsNullOrWhiteSpace(request.FirstName))
                return ErrorCodes.FirstNameEmpty;

            if (request.FirstName.Length > 100)
                return ErrorCodes.FirstNameTooLong;

            if (string.IsNullOrWhiteSpace(request.LastName))
                return ErrorCodes.LastNameEmpty;

            if (request.LastName.Length > 100)
                return ErrorCodes.LastNameTooLong;

            if (request.DateOfBirth == default)
                return ErrorCodes.DateOfBirthEmpty;

            if (request.DateOfBirth > DateOnly.FromDateTime(DateTimeOffset.Now.Date))
                return ErrorCodes.DateOfBirthInFuture;

            return null;
        }

        private static ErrorCodes? ValidateAuthenticate(AuthUserRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return ErrorCodes.EmailEmpty;

            if (string.IsNullOrWhiteSpace(request.Password))
                return ErrorCodes.PasswordEmpty;

            return null;
        }

        private static bool EmailIsValid(string email)
        {
            return System.Text.RegularExpressions.Regex.IsMatch(
                email,
                @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
        }

        private static bool PasswordIsValid(string password)
        {
            return System.Text.RegularExpressions.Regex.IsMatch(
                password,
                @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$");
        }

        #endregion
    }
}
