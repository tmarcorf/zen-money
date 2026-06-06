using ZenMoney.Application.Models.Investment;
using ZenMoney.Application.Requests.Investment;
using ZenMoney.Application.Results;
using ZenMoney.Core.Search;

namespace ZenMoney.Application.Interfaces
{
    public interface IInvestmentService
    {
        Task<Result<InvestmentModel>> GetByIdAsync(Guid id);

        Task<PaginatedResult<List<InvestmentModel>>> ListPaginatedAsync(SearchInvestmentRequest request);

        Task<Result<InvestmentModel>> CreateAsync(CreateInvestmentRequest request);

        Task<Result<InvestmentModel>> UpdateAsync(UpdateInvestmentRequest request);

        Task<Result<InvestmentModel>> DeleteAsync(Guid id);
    }
}
