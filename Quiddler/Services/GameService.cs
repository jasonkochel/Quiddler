using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Quiddler.Data;
using Quiddler.Models;

namespace Quiddler.Services
{
    public interface IGameService
    {
        Task<GameModel> Get(string gameId);
        Task<IEnumerable<GameListModel>> GetAll();

        Task<GameModel> Create(string firstPlayerName);
        Task<GameModel> AddPlayer(string gameId, string newPlayerName);
        Task<GameModel> StartRound(string gameId);
        Task<GameModel> MakeMove(string gameId, MoveModel move);

        Task Delete(string gameId);
    }

    public class GameService : IGameService
    {
        private readonly IGameRepository _repo;
        private readonly IDeckService _deckService;
        private readonly IDictionaryService _dictionaryService;

        public GameService(IGameRepository repo, IDeckService deckService, IDictionaryService dictionaryService)
        {
            _repo = repo;
            _deckService = deckService;
            _dictionaryService = dictionaryService;
        }

        public async Task<GameModel> Get(string gameId) => Mapper.MapEntityToModel(await _repo.Get(gameId));

        public async Task<IEnumerable<GameListModel>> GetAll()
        {
            var games = await _repo.GetAll();
            return games.Select(Mapper.MapEntityToListModel);
        }

        public async Task<GameModel> Create(string firstPlayerName)
        {
            var gameId = await _repo.Create(new Game
            {
                Players = new List<Player>
                {
                    new Player {Name = firstPlayerName}
                }
            });

            return await Get(gameId);
        }

        public async Task<GameModel> AddPlayer(string gameId, string newPlayerName)
        {
            var game = await _repo.Get(gameId);

            if (game.Players.Any(p => p.Name == newPlayerName))
            {
                throw new Exception($"Player '{newPlayerName}' is already part of this game");
            }

            game.Players.Add(new Player { Name = newPlayerName });

            await _repo.Update(game);

            return Mapper.MapEntityToModel(game);
        }

        public async Task<GameModel> StartRound(string gameId)
        {
            var game = await _repo.Get(gameId);

            // Starting game for first time
            if (game.Round == null) game.Round = 1;

            var deck = _deckService.GenerateShuffled();

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

            game.Turn = game.Round.Value % game.Players.Count;

            await _repo.Update(game);

            return Mapper.MapEntityToModel(game);
        }

        public async Task<GameModel> MakeMove(string gameId, MoveModel move)
        {
            var game = await _repo.Get(gameId);

            // TODO ensure it is move.Player's turn

            switch (move.Type)
            {
                case MoveType.DrawFromDiscard:
                    game.Players[game.Turn].Hand.Add(game.DiscardPile.Pop());
                    break;

                case MoveType.DrawFromShoe:
                    game.Players[game.Turn].Hand.Add(game.Deck.Pop());
                    break;

                case MoveType.Discard:
                    if (!game.Players[game.Turn].Hand.Contains(move.Discard))
                    {
                        throw new Exception($"Cannot discard '{move.Discard}' because it is not in your hand");
                    }

                    game.Players[game.Turn].Hand.Remove(move.Discard);
                    game.DiscardPile.Push(move.Discard);
                    game.Turn = (game.Turn + 1) % game.Players.Count;
                    break;

                case MoveType.GoOut:
                    var validatedWords = await _dictionaryService.CheckWords(move.Words.ToArray());
                    if (validatedWords.InvalidWords.Any())
                    {
                        throw new Exception($"One or more words are invalid: {validatedWords.InvalidWords}");
                    }

                    var firstOneOut = !game.Players.Any(p => p.IsGoingOut);

                    if (firstOneOut)
                    {
                        var cardsInWords = move.Words.Sum(w => w.Length);
                        if (cardsInWords < game.Round + 2)
                        {
                            throw new Exception("First player to go out must use all of the cards in their hand");
                        }
                    }

                    var score = move.Words.Sum(_deckService.GetWordValue);

                    Debug.Assert(game.Round != null, "game.Round != null");

                    game.Players[game.Turn].IsGoingOut = true;
                    game.Players[game.Turn].Hand.Clear();
                    game.Players[game.Turn].Words = move.Words.ToList();
                    game.Players[game.Turn].Scores[game.Round.Value - 1] = score;

                    game.DiscardPile.Push(move.Discard);
                    game.Turn = (game.Turn + 1) % game.Players.Count;

                    break;

                default:
                    throw new ArgumentOutOfRangeException();
            }

            await _repo.Update(game);

            if (move.Type == MoveType.GoOut)
            {
                var lastOneOut = game.Players.All(p => p.IsGoingOut);

                if (lastOneOut)
                {
                    game.Round++;
                    return await StartRound(game.GameId);
                }
            }

            return Mapper.MapEntityToModel(game);
        }

        public async Task Delete(string gameId)
        {
            await _repo.Delete(gameId);
        }
    }
}
