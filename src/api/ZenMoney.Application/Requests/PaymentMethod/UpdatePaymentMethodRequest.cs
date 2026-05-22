using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ZenMoney.Application.Requests.PaymentMethod
{
    public class UpdatePaymentMethodRequest : CreatePaymentMethodRequest
    {
        public Guid Id { get; set; }
    }
}
