using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.User;

namespace ZenMoney.Application.Models.Category
{
    public class CategoryModel : BaseModel
    {
        public string Name { get; set; }

        public UserModel User { get; set; }
    }
}
