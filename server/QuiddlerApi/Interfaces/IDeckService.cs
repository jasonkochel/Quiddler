using QuiddlerApi.Models;

namespace QuiddlerApi.Interfaces;

public interface IDeckService
{
    Stack<string> GenerateShuffled();
    int GetWordValue(string word);
    CardModel ToCardModel(string card);
}