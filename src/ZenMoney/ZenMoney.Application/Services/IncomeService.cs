using FluentValidation;
using ZenMoney.Application.Extensions;
using ZenMoney.Application.Interfaces;
using ZenMoney.Application.Models.Income;
using ZenMoney.Application.Requests.Income;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Application.Services
{
    public class IncomeService(
        IIncomeRepository repository,
        //ApplicationDbContext dbContext,
        IValidator<CreateIncomeRequest> createValidator) : IIncomeService
    {
        public async Task<IncomeModel> GetByIdAsync(Guid id)
        {
            if (id.Equals(Guid.Empty)) return null;

            var income = await repository.GetByIdAsync(id);

            return income.ToModel();
        }

        public Task<IncomeModel> CreateAsync(CreateIncomeRequest request)
        {
            var result = createValidator.Validate(request);

            if (!result.IsValid)
            {

            }

            return null;
        }

        public Task<IncomeModel> UpdateAsync(UpdateIncomeRequest request)
        {
            throw new NotImplementedException();
        }

        public Task<IncomeModel> DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }
    }
}
