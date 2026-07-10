using Microsoft.AspNetCore.Http;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Results;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Enums;
using ZenMoney.Core.Interfaces;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Services
{
    public class CategoryService(
        ICategoryRepository categoryRepository,
        IHttpContextAccessor httpContextAcessor) : BaseService(httpContextAcessor), ICategoryService
    {
        public async Task<Result<CategoryModel>> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                return Result<CategoryModel>.Failure(ErrorCodes.InvalidId);
            }

            var category = await categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                return Result<CategoryModel>.Failure(ErrorCodes.CategoryNotFound);
            }

            return Result<CategoryModel>.Success(category.ToModel());
        }

        public async Task<PaginatedResult<List<CategoryModel>>> ListPaginatedAsync(SearchCategoryRequest request)
        {
            var userId = GetUserId();

            var categories = await categoryRepository.ListPaginatedAsync(request, userId);
            var count = await categoryRepository.CountPaginatedAsync(request, userId);

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

            var validationError = await ValidateCreateAsync(request);
            if (validationError.HasValue)
                return Result<CategoryModel>.Failure(validationError.Value);

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

            var validationError = await ValidateUpdateAsync(request);
            if (validationError.HasValue)
                return Result<CategoryModel>.Failure(validationError.Value);

            var category = await categoryRepository.GetByIdAsync(request.Id);
            category.Name = request.Name;
            category.UpdatedAt = DateTimeOffset.UtcNow;

            await categoryRepository.UpdateEntityAsync(category);

            return Result<CategoryModel>.Success(category.ToModel());
        }

        public async Task<Result<CategoryModel>> DeleteAsync(Guid id)
        {
            if (id.Equals(Guid.Empty))
            {
                return Result<CategoryModel>.Failure(ErrorCodes.InvalidId);
            }

            var category = await categoryRepository.GetByIdAsync(id);

            if (category == null)
            {
                return Result<CategoryModel>.Failure(ErrorCodes.CategoryNotFound);
            }

            var validationError = await ValidateDeleteAsync(category);
            if (validationError.HasValue)
                return Result<CategoryModel>.Failure(validationError.Value);

            categoryRepository.Delete(category);
            await categoryRepository.SaveChangesAsync();

            return Result<CategoryModel>.Success(category.ToModel());
        }

        #region Private Validation Methods

        private async Task<ErrorCodes?> ValidateCreateAsync(CreateCategoryRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                return ErrorCodes.CategoryNameEmpty;

            if (request.Name.Length > 50)
                return ErrorCodes.CategoryNameTooLong;

            var exists = await categoryRepository.ExistsAsync(c =>
                c.UserId == request.UserId && c.Name == request.Name);

            if (exists)
                return ErrorCodes.CategoryAlreadyExists;

            return null;
        }

        private async Task<ErrorCodes?> ValidateUpdateAsync(UpdateCategoryRequest request)
        {
            if (request.Id == Guid.Empty)
                return ErrorCodes.InvalidId;

            var entityExists = await categoryRepository.ExistsAsync(x => x.Id == request.Id);
            if (!entityExists)
                return ErrorCodes.CategoryNotFound;

            if (string.IsNullOrWhiteSpace(request.Name))
                return ErrorCodes.CategoryNameEmpty;

            if (request.Name.Length > 50)
                return ErrorCodes.CategoryNameTooLong;

            var duplicateExists = await categoryRepository.ExistsAsync(c =>
                c.Id != request.Id && c.UserId == request.UserId && c.Name == request.Name);

            if (duplicateExists)
                return ErrorCodes.CategoryAlreadyExists;

            return null;
        }

        private async Task<ErrorCodes?> ValidateDeleteAsync(Category category)
        {
            var isBeingUsed = await categoryRepository.IsBeingUsed(category.Id, category.UserId);

            if (isBeingUsed)
                return ErrorCodes.CategoryInUse;

            return null;
        }

        #endregion
    }
}
