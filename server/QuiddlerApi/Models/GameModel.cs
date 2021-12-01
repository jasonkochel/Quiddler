using QuiddlerApi.Data;
using QuiddlerApi.Interfaces;

namespace QuiddlerApi.Models;

public class GameListModel
{
    public string GameId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool HasStarted { get; set; }
    public int? Round { get; set; }
    public List<string> Players { get; set; }
    public string WhoseTurn { get; set; }
}

public class GameModel
{
    public string GameId { get; set; }
    public int CardsInRound { get; set; }
    public CardModel TopOfDiscardPile { get; set; }
    public string WhoseTurn { get; set; }
    public RoundStatus RoundStatus { get; set; }
    public List<PlayerModel> Players { get; set; }
}

public enum RoundStatus
{
    InProgress,
    MustGoOut,
    AwaitingNextRound,
    GameOver
}

public class GameMapper
{
    private readonly IDeckService _deckService;

    public GameMapper(IDeckService deckService)
    {
        _deckService = deckService;
    }

    public GameListModel MapEntityToListModel(Game game)
    {
        return new GameListModel
        {
            GameId = game.GameId,
            CreatedAt = game.CreatedAt,
            HasStarted = game.Round != 0,
            Round = game.Round,
            WhoseTurn = game.Players[game.Turn].Name,
            Players = game.Players.Select(p => p.Name).ToList()
        };
    }

    public GameModel MapEntityToModel(Game game, string myName)
    {
        if (game == null) return null;

        return new GameModel
        {
            GameId = game.GameId,
            CardsInRound = game.Round + 2,
            TopOfDiscardPile = game.DiscardPile == null || game.DiscardPile.Count == 0
                ? null
                : _deckService.ToCardModel(game.DiscardPile.Peek()),
            WhoseTurn = game.Players[game.Turn].Name,
            RoundStatus =
                game.Players.All(p => p.HasGoneOut)
                    ?
                    (game.Round == 8 ? RoundStatus.GameOver : RoundStatus.AwaitingNextRound)
                    :
                    game.Players.Any(p => p.HasGoneOut)
                        ? RoundStatus.MustGoOut
                        :
                        RoundStatus.InProgress,
            Players = game.Players.Select(p => new PlayerModel
            {
                Name = p.Name,
                HasGoneOut = p.HasGoneOut,
                ReadyForNextRound = p.ReadyForNextRound,
                Hand = p.Name == myName && p.Hand != null
                    ? p.Hand.Select(c => _deckService.ToCardModel(c)).ToList()
                    : null,
                RoundScore = game.Round == 0 ? 0 : p.Scores[game.Round - 1],
                TotalScore = p.Scores.Sum(s => s),
                Words = p.Words?.Select(w => w.Select(c => _deckService.ToCardModel(c)).ToList()).ToList()
            }).ToList()
        };
    }
}