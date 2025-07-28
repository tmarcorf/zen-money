using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Application.Models.Category;
using ZenMoney.Application.Requests.Category;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Extensions
{
    public static class CategoryExtensions
    {
        public static CategoryModel ToModel(this Category entity)
        {
            return new CategoryModel
            {
                Id = entity.Id,
                Name = entity.Name,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static Category ToEntity(this CreateCategoryRequest request)
        {
            return new Category
            {
                Name = request.Name
            };
        }
    }
}
