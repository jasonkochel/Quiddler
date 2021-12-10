using QuiddlerApi.Interfaces;
using QuiddlerApi.Models;

namespace QuiddlerApi.Services;

public abstract class BaseDeckService : IDeckService
{
    protected static readonly string[] Cards =
    {
        "A-1", "A-2", "A-3", "A-4", "A-5", "A-6", "A-7", "A-8", "A-9", "A-10", "B-1", "B-2", "C-1", "C-2", "D-1",
        "D-2", "D-3", "D-4", "E-1", "E-2", "E-3", "E-4", "E-5", "E-6", "E-7", "E-8", "E-9", "E-10", "E-11", "E-12",
        "F-1", "F-2", "G-1", "G-2", "G-3", "G-4", "H-1", "H-2", "I-1", "I-2", "I-3", "I-4", "I-5", "I-6", "I-7",
        "I-8", "J-1", "J-2", "K-1", "K-2", "L-1", "L-2", "L-3", "L-4", "M-1", "M-2", "N-1", "N-2", "N-3", "N-4",
        "N-5", "N-6", "O-1", "O-2", "O-3", "O-4", "O-5", "O-6", "O-7", "O-8", "P-1", "P-2", "Q-1", "Q-2", "R-1",
        "R-2", "R-3", "R-4", "R-5", "R-6", "S-1", "S-2", "S-3", "S-4", "T-1", "T-2", "T-3", "T-4", "T-5", "T-6",
        "U-1", "U-2", "U-3", "U-4", "U-5", "U-6", "V-1", "V-2", "W-1", "W-2", "X-1", "X-2", "Y-1", "Y-2", "Y-3",
        "Y-4", "Z-1", "Z-2", "QU-1", "QU-2", "IN-1", "IN-2", "ER-1", "ER-2", "CL-1", "CL-2", "TH-1", "TH-2"
    };

    private static readonly Dictionary<string, int> Values = new()
    {
        { "A", 2 },
        { "B", 8 },
        { "C", 8 },
        { "D", 5 },
        { "E", 2 },
        { "F", 6 },
        { "G", 6 },
        { "H", 7 },
        { "I", 2 },
        { "J", 13 },
        { "K", 8 },
        { "L", 3 },
        { "M", 5 },
        { "N", 5 },
        { "O", 2 },
        { "P", 6 },
        { "Q", 15 },
        { "R", 5 },
        { "S", 3 },
        { "T", 3 },
        { "U", 4 },
        { "V", 11 },
        { "W", 10 },
        { "X", 12 },
        { "Y", 4 },
        { "Z", 14 },
        { "QU", 9 },
        { "IN", 7 },
        { "ER", 7 },
        { "CL", 10 },
        { "TH", 9 }
    };

    public abstract Stack<string> GenerateShuffled();

    public int GetWordValue(string word)
    {
        return word.Sum(c => Values[c.ToString().ToUpper()]);
    }

    public CardModel ToCardModel(string card)
    {
        var letter = card[..card.IndexOf('-')];

        return new CardModel
        {
            CardId = card,
            Letter = letter,
            Value = Values[letter]
        };
    }
}

public class DeckService : BaseDeckService
{
    public override Stack<string> GenerateShuffled()
    {
        var deck = Cards.Select(c => c).ToArray();
        new Random().Shuffle(deck);
        return new Stack<string>(deck);
    }
}

public class MockDeckService : BaseDeckService
{
    public override Stack<string> GenerateShuffled()
    {
        var deck = Cards.Select(c => c).ToArray();
        new Random(1).Shuffle(deck);
        return new Stack<string>(deck);
    }
}
