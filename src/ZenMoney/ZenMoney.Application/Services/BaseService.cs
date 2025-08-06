using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ZenMoney.Core.Entities;

namespace ZenMoney.Application.Services
{
    public class BaseService(IHttpContextAccessor httpContextAcessor)
    {
        public Guid GetUserId()
        {
            Guid userId;
            var userIdClaim = httpContextAcessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out userId))
            {
                throw new UnauthorizedAccessException("Not authorized user");
            }

            return userId;
        }
    }
}
