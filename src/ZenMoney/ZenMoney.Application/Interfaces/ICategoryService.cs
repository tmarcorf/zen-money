using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Results;

namespace ZenMoney.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<CategoryModel>> GetByIdAsync(Guid id);

        Task<Result<List<CategoryModel>>> GetAllAsync(SearchCategoryRequest request);

        Task<Result<CategoryModel>> CreateAsync(CreateCategoryRequest request);

        Task<Result<CategoryModel>> UpdateAsync(UpdateCategoryRequest request);

        Task<Result<CategoryModel>> DeleteAsync(Guid id);
    }
}
