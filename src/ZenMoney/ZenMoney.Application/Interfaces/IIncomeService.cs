using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Income;
using ZenMoney.Application.Requests;

namespace ZenMoney.Application.Interfaces
{
    public interface IIncomeService
    {
        Task<IncomeModel> GetByIdAsync(Guid id);

        Task<IncomeModel> CreateAsync(CreateIncomeRequest request);

        Task<IncomeModel> UpdateAsync(UpdateIncomeRequest request);

        Task<IncomeModel> DeleteAsync(Guid id);
    }
}
