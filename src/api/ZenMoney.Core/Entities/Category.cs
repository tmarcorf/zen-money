using System.ComponentModel.DataAnnotations;

namespace ZenMoney.Core.Entities
{
    public class Category : BaseEntity
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; }
    }
}
