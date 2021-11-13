using System.Diagnostics;
using QuiddlerApi.Controllers;
using QuiddlerApi.Data;
using QuiddlerApi.Interfaces;
using QuiddlerApi.Models;

namespace QuiddlerApi.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _repo;
    private readonly IDeckService _deckService;
    private readonly IDictionaryService _dictionaryService;
    private readonly IWsService _wsService;

    private readonly UserIdentity _identity;
    private readonly GameMapper _mapper;

    public GameService(IGameRepository repo, IDeckService deckService, IDictionaryService dictionaryService,
        UserIdentity identity, GameMapper mapper, IWsService wsService)
    {
        _repo = repo;
        _deckService = deckService;
        _dictionaryService = dictionaryService;
        _identity = identity;
        _mapper = mapper;
        _wsService = wsService;
    }

    public async Task<GameModel> Get(string gameId) => _mapper.MapEntityToModel(await _repo.Get(gameId), _identity.Name);

    public async Task<IEnumerable<GameListModel>> GetAll()
    {
        var games = await _repo.GetAll();
        return games.Select(_mapper.MapEntityToListModel);
    }

    public async Task<GameModel> Create()
    {
        var gameId = await _repo.Create(new Game
        {
            Players = new List<Player>
            {
                new Player {Name = _identity.Name}
            }
        });

        return await Get(gameId);
    }

    public async Task<GameModel> AddPlayer(string gameId)
    {
        var game = await _repo.Get(gameId);
        var newPlayerName = _identity.Name;

        if (game.Players.Any(p => p.Name == newPlayerName))
        {
            throw new Exception($"Player '{newPlayerName}' is already part of this game");
        }

        game.Players.Add(new Player { Name = newPlayerName });

        await _repo.Update(game);

        return _mapper.MapEntityToModel(game, _identity.Name);
    }

    public async Task<GameModel> StartRound(string gameId)
    {
        var game = await _repo.Get(gameId);

        game.Round = game.Round == null ? 1 : game.Round + 1;

        var deck = _deckService.GenerateShuffled();

        game.Players.ForEach(p =>
        {
            p.Hand = new List<string>();
            p.IsGoingOut = false;
            p.Words = null;
        });

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

        await _wsService.SendMessageToChannel("Update Available", gameId);

        return _mapper.MapEntityToModel(game, _identity.Name);
    }

    public async Task<GameModel> MakeMove(string gameId, MoveModel move)
    {
        var game = await _repo.Get(gameId);

        if (game.Players[game.Turn].Name != _identity.Name)
        {
            throw new Exception("Not your turn");
        }

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
                if (!game.Players[game.Turn].Hand.Contains(move.Discard))
                {
                    throw new Exception($"Cannot discard '{move.Discard}' because it is not in your hand");
                }

                var validatedWords = await _dictionaryService.CheckWords(move.Words);
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

                game.Players[game.Turn].Hand.Remove(move.Discard);

                var score = move.Words.Sum(_deckService.GetWordValue) -
                            game.Players[game.Turn].Hand.Sum(c => _deckService.ToCardModel(c).Value);

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
            var roundOver = game.Players.All(p => p.IsGoingOut);
            if (roundOver)
            {
                return await StartRound(game.GameId);
            }
        }

        await _repo.Update(game);

        await _wsService.SendMessageToChannel("Update Available", gameId);

        return _mapper.MapEntityToModel(game, _identity.Name);
    }

    public async Task<GameModel> SortHand(string gameId, string newHand)
    {
        var game = await _repo.Get(gameId);
        game.Players.Single(p => p.Name == _identity.Name).Hand = newHand.Split(',').ToList();
        await _repo.Update(game);
        return _mapper.MapEntityToModel(game, _identity.Name);
    }

    public async Task Delete(string gameId)
    {
        await _repo.Delete(gameId);
    }
}