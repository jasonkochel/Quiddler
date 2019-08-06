using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiddler.Models
{
    public class UserModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class UserView
    {
        // ReSharper disable once InconsistentNaming
        public string tokenId { get; set; }
    }
}
