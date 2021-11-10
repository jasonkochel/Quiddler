using QuiddlerApi.Models;

namespace QuiddlerApi.Interfaces;

public interface IGameService
{
    Task<GameModel> Get(string gameId);
    Task<IEnumerable<GameListModel>> GetAll();

    Task<GameModel> Create();
    Task<GameModel> AddPlayer(string gameId);
    Task<GameModel> StartRound(string gameId);
    Task<GameModel> MakeMove(string gameId, MoveModel move);
    Task<GameModel> SortHand(string gameId, string newHand);

    Task Delete(string gameId);
}