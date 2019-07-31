using System.Collections.Generic;

namespace Quiddler.Services
{
    public class PlayerService
    {
        public string Name { get; set; }
        public bool IsGoingOut { get; set; }
        public List<string> Hand { get; set; }
        public Dictionary<int, int> Scores { get; set; }

        public PlayerService(string name)
        {
            Name = name;
            Hand = new List<string>();
            Scores = new Dictionary<int, int>();
        }
    }
}
