using System;
using System.Collections.Generic;
using System.Linq;

namespace Quiddler.Services
{
    public interface IDeckService
    {
        Stack<string> GenerateShuffled();
        int GetWordValue(string word);
    }

    public abstract class BaseDeckService : IDeckService
    {
        protected readonly string[] Cards = {
            "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "B", "B", "C", "C", "D", "D", "D", "D",
            "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "F", "F", "G", "G", "G", "G",
            "H", "H", "I", "I", "I", "I", "I", "I", "I", "I", "J", "J", "K", "K", "L", "L", "L", "L",
            "M", "M", "N", "N", "N", "N", "N", "N", "O", "O", "O", "O", "O", "O", "O", "O", "P", "P",
            "Q", "Q", "R", "R", "R", "R", "R", "R", "S", "S", "S", "S", "T", "T", "T", "T", "T", "T",
            "U", "U", "U", "U", "U", "U", "V", "V", "W", "W", "X", "X", "Y", "Y", "Y", "Y", "Z", "Z",
            "QU", "QU", "IN", "IN", "ER", "ER", "CL", "CL", "TH", "TH"
        };

        private readonly Dictionary<string, int> _values = new Dictionary<string, int>
        {
            {"A", 2}, {"B", 8}, {"C", 8}, {"D", 5}, {"E", 2}, {"F", 6}, {"G", 6}, {"H", 7}, {"I", 2}, {"J", 13},
            {"K", 8}, {"L", 3}, {"M", 5}, {"N", 5}, {"O", 2}, {"P", 6}, {"Q", 15}, {"R", 5}, {"S", 3}, {"T", 3},
            {"U", 4}, {"V", 11}, {"W", 10}, {"X", 12}, {"Y", 4}, {"Z", 14}, {"QU", 9}, {"IN", 7}, {"ER", 7}, {"CL", 10},
            {"TH", 9}
        };

        public abstract Stack<string> GenerateShuffled();

        public int GetWordValue(string word)
        {
            return word.Sum(c => _values[c.ToString().ToUpper()]);
        }
    }

    public class DeckService : BaseDeckService
    {
        public override Stack<string> GenerateShuffled()
        {
            var deck = Cards.Select(c => c).ToArray();
            (new Random()).Shuffle(deck);
            return new Stack<string>(deck);
        }

    }

    public class MockDeckService : BaseDeckService
    {
        public override Stack<string> GenerateShuffled()
        {
            var deck = Cards.Select(c => c).ToArray();
            (new Random(1)).Shuffle(deck);
            return new Stack<string>(deck);
        }
    }
}
