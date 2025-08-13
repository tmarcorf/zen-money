using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Core.Search
{
    public class SearchPaymentMethodRequest : BaseSearchRequest
    {
        public string? Description { get; set; }
    }
}
