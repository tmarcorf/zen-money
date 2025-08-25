using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Entities;
using ZenMoney.Core.Interfaces;

namespace ZenMoney.Infrastructure.Data.Repositories
{
    public class InstallmentPurchaseRepository : BaseRepository<InstallmentPurchase>, IInstallmentPurchaseRepository
    {
        private const int DECIMALS = 2;

        public InstallmentPurchaseRepository(ApplicationDbContext dbContext) 
            : base(dbContext)
        {
        }
    }
}
