using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Models.User;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Results;
using ZenMoney.Application.Validators.User;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Services
{
    public class CategoryService(
        ICategoryRepository categoryRepository,
        IValidator<CreateCategoryRequest> createCategoryValidator,
        IValidator<UpdateCategoryRequest> updateCategoryValidator) : ICategoryService
    {
        public async Task<Result<CategoryModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<CategoryModel>.Failure(errors);
            }

            var category = await categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<CategoryModel>.Failure(errors);
            }

            return Result<CategoryModel>.Success(category.ToModel());
        }

        public async Task<Result<CategoryModel>> CreateAsync(CreateCategoryRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            var validationResult = createCategoryValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<CategoryModel>.Failure(errors);
            }

            var category = request.ToEntity();
            category.Id = Guid.NewGuid();
            category.CreatedAt = DateTimeOffset.UtcNow;

            categoryRepository.Create(category);
            await categoryRepository.SaveChangesAsync();

            return Result<CategoryModel>.Success(category.ToModel());
        }

        public async Task<Result<CategoryModel>> UpdateAsync(UpdateCategoryRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            var validationResult = updateCategoryValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<CategoryModel>.Failure(errors);
            }

            var category = await categoryRepository.GetByIdAsync(request.Id);
            category.UpdatedAt = DateTimeOffset.UtcNow;

            category.Update(request);
            categoryRepository.Update(category);
            await categoryRepository.SaveChangesAsync();

            return Result<CategoryModel>.Success(category.ToModel());
        }

        public async Task<Result<CategoryModel>> DeleteAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<CategoryModel>.Failure(errors);
            }

            var category = await categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                var errors = ErrorHelper.GetInvalidParameterError(nameof(id), id.ToString());

                return Result<CategoryModel>.Failure(errors);
            }

            categoryRepository.Delete(category);
            await categoryRepository.SaveChangesAsync();

            return Result<CategoryModel>.Success(category.ToModel());
        }
    }
}
