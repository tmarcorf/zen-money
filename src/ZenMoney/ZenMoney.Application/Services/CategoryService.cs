using FluentValidation;
using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Helpers;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Services
{
    public class CategoryService(
        ICategoryRepository categoryRepository,
        IValidator<CreateCategoryRequest> createCategoryValidator,
        IValidator<UpdateCategoryRequest> updateCategoryValidator,
        IHttpContextAccessor httpContextAcessor) : BaseService(httpContextAcessor), ICategoryService
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

        public async Task<PaginatedResult<List<CategoryModel>>> ListPaginatedAsync(SearchCategoryRequest request)
        {
            var userId = GetUserId();

            var categories = await categoryRepository.ListPaginatedAsync(request, userId);
            var count = await categoryRepository.CountAsync(userId);

            return PaginatedResult<List<CategoryModel>>.Success(categories.ToModels(), count);
        }

        public async Task<Result<List<CategoryModel>>> ListByNameAsync(string name)
        {
            var userId = GetUserId();

            var categories = await categoryRepository.ListByNameAsync(name, userId);

            return Result<List<CategoryModel>>.Success(categories.ToModels());
        }

        public async Task<Result<CategoryModel>> CreateAsync(CreateCategoryRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();
            var validationResult = createCategoryValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<CategoryModel>.Failure(errors);
            }

            var category = new Category();
            category.Id = Guid.NewGuid();
            category.UserId = request.UserId;
            category.Name = request.Name;
            category.CreatedAt = DateTimeOffset.UtcNow;
            category.UpdatedAt = DateTimeOffset.UtcNow;

            categoryRepository.Create(category);
            await categoryRepository.SaveChangesAsync();

            return Result<CategoryModel>.Success(category.ToModel());
        }

        public async Task<Result<CategoryModel>> UpdateAsync(UpdateCategoryRequest request)
        {
            if (request == null) ArgumentNullException.ThrowIfNull(request);

            request.UserId = GetUserId();
            var validationResult = updateCategoryValidator.Validate(request);

            if (!validationResult.IsValid)
            {
                var errors = ErrorHelper.GetErrors(validationResult);

                return Result<CategoryModel>.Failure(errors);
            }

            var category = await categoryRepository.GetByIdAsync(request.Id);
            category.Name = request.Name;
            category.UpdatedAt = DateTimeOffset.UtcNow;

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
