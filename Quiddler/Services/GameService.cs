using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Quiddler.Data;
using Quiddler.Models;

namespace Quiddler.Services
{
    public interface IGameService
    {
        Task<GameModel> Get(string gameId);
        Task<GameModel> Create(string firstPlayerName);
        Task<GameModel> AddPlayer(string gameId, string newPlayerName);
        Task<GameModel> StartRound(string gameId);
        Task EndRound(string gameId);
    }

    public class GameService : IGameService
    {
        private readonly IGameRepository _repo;

        public GameService(IGameRepository repo)
        {
            _repo = repo;
        }

        public async Task<GameModel> Get(string gameId)
        {
            var game = await _repo.Get(gameId);
            return Mapper.MapEntityToModel(game);
        }

        public async Task<GameModel> Create(string firstPlayerName)
        {
            var gameId = await _repo.Create(new Game
            {
                Round = 1,
                Players = new List<Player>
                {
                    new Player {Name = firstPlayerName}
                }
            });

            return Mapper.MapEntityToModel(await _repo.Get(gameId));
        }

        public async Task<GameModel> AddPlayer(string gameId, string newPlayerName)
        {
            var game = await _repo.Get(gameId);

            game.Players.Add(new Player
            {
                Name = newPlayerName
            });

            await _repo.Update(game);

            return Mapper.MapEntityToModel(game);
        }

        public async Task<GameModel> StartRound(string gameId)
        {
            var game = await _repo.Get(gameId);

            var deck = DeckService.GenerateShuffled();

            game.Players.ForEach(p => p.Hand = new List<string>());

            for (var i = 0; i < game.Round + 2; i++)
            {
                foreach (var player in game.Players)
                {
                    player.Hand.Add(deck.Pop());
                }
            }

            game.DiscardPile = new Stack<string>();
            game.DiscardPile.Push(deck.Pop());
            game.Deck = deck;

            game.Turn = game.Round % game.Players.Count;

            await _repo.Update(game);

            return Mapper.MapEntityToModel(game);
        }

        public async Task EndRound(string gameId)
        {
            var game = await _repo.Get(gameId);

            game.Round++;

            await _repo.Update(game);
        }
    }
}
