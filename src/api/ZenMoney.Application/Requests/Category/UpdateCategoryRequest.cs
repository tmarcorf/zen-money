using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Application.Requests.Category
{
    public class UpdateCategoryRequest : CreateCategoryRequest
    {
        public Guid Id { get; set; }
    }
}
