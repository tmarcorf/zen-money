using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Application.Requests
{
    public class BaseSearchRequest
    {
        public int Offset { get; set; }

        public int Take { get; set; }
    }
}
