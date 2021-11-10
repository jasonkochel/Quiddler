using QuiddlerApi.Data;

namespace QuiddlerApi.Interfaces;

public interface IGameRepository
{
    Task<IEnumerable<Game>> GetAll();
    Task<Game> Get(string id);
    Task<string> Create(Game game);
    Task Update(Game game);
    Task Delete(string id);
}