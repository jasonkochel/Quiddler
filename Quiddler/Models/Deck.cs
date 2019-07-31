using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiddler.Models
{
    public class Deck
    {
        private readonly string[] cards = new []
        {
            "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D",
            "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "F", "F", "G", "G", "G", "G",
            "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "J", "J", "K", "K", "L", "L", "L", "L",
            "M", "M", "N", "N", "N", "N", "N", "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P",
            "Q", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T",
            "U", "U", "U", "U", "U", "U", "V", "V", "W", "W", "X", "X", "Y", "Y", "Y", "Y", "Z", "Z",
            "QU", "QU", "IN", "IN", "ER", "ER", "CL", "CL", "TH", "TH"
        };

        private Stack<string> shoe;

        public Deck()
        {
            new Random().Shuffle(cards);
            shoe = new Stack<string>(cards);
        }

        public string Draw()
        {
            return shoe.Pop();
        }

    }

    public class Game
    {
        private Deck _deck;
        private Stack<string> _discardPile;
        private List<Player> _players;

        public Game(List<string> players)
        {
            _players = players.Select(p => new Player { Name = p, IsGoingOut = false, IsTurn = false }).ToList();
            _players[0].IsTurn = true;

            _deck = new Deck();
            _discardPile = new Stack<string>();
            _discardPile.Push(_deck.Draw());
        }
    }

    public class Player
    {
        public string Name { get; set; }
        public bool IsTurn { get; set; }
        public bool IsGoingOut { get; set; }
        public List<string> Hand { get; set; }
        public List<string> Words { get; set; }
    }
}
