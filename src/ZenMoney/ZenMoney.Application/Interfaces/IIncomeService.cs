using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Income;
using ZenMoney.Application.Requests.Income;
using ZenMoney.Application.Results;

namespace ZenMoney.Application.Interfaces
{
    public interface IIncomeService
    {
        Task<Result<IncomeModel>> GetByIdAsync(Guid id);

        Task<Result<IncomeModel>> CreateAsync(CreateIncomeRequest request);

        Task<Result<IncomeModel>> UpdateAsync(UpdateIncomeRequest request);

        Task<Result<IncomeModel>> DeleteAsync(Guid id);
    }
}
