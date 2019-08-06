using System.Collections.Generic;

namespace Quiddler.Models
{
    public class PlayerModel
    {
        public string Name { get; set; }
        public bool IsGoingOut { get; set; }
        public List<string> Hand { get; set; }
        public List<string> Words { get; set; }
        public int Score { get; set; }
    }
}