using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ZenMoney.Application.Requests.PaymentMethod
{
    public class CreatePaymentMethodRequest
    {
        public string Description { get; set; }

        [JsonIgnore]
        public Guid UserId { get; set; }
    }
}
