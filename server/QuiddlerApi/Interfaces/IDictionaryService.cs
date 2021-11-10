using QuiddlerApi.Models;

namespace QuiddlerApi.Interfaces;

public interface IDictionaryService
{
    Task<DictionaryModel> CheckWords(IEnumerable<string> words);
}