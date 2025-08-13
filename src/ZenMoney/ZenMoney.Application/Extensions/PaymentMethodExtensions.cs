using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.PaymentMethod;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Application.Requests.PaymentMethod;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Extensions
{
    public static class PaymentMethodExtensions
    {
        public static PaymentMethodModel ToModel(this PaymentMethod entity)
        {
            return new PaymentMethodModel
            {
                Id = entity.Id,
                Description = entity.Description,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static List<PaymentMethodModel> ToModels(this IEnumerable<PaymentMethod> entities)
        {
            return entities
                .Select(x => x.ToModel())
                .ToList();
        }

        public static PaymentMethod ToEntity(this PaymentMethodModel model)
        {
            return new PaymentMethod
            {
                Description = model.Description,
            };
        }

        public static PaymentMethod ToEntity(this CreatePaymentMethodRequest request)
        {
            return new PaymentMethod
            {
                UserId = request.UserId,
                Description = request.Description,
            };
        }
    }
}
