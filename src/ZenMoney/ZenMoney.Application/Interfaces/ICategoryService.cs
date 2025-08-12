using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Results;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<CategoryModel>> GetByIdAsync(Guid id);

        Task<PaginatedResult<List<CategoryModel>>> ListPaginatedAsync(SearchCategoryRequest request);

        Task<Result<CategoryModel>> CreateAsync(CreateCategoryRequest request);

        Task<Result<CategoryModel>> UpdateAsync(UpdateCategoryRequest request);

        Task<Result<CategoryModel>> DeleteAsync(Guid id);
    }
}
