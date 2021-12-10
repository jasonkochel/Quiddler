using QuiddlerApi.Data;
using QuiddlerApi.Interfaces;

namespace QuiddlerApi.Models;

public record GameListModel
{
    public string GameId { get; init; }
    public DateTime CreatedAt { get; init; }
    public bool HasStarted { get; init; }
    public int? Round { get; init; }
    public List<string> Players { get; init; }
    public string WhoseTurn { get; init; }
}

public record GameModel
{
    public string GameId { get; init; }
    public int CardsInRound { get; init; }
    public CardModel TopOfDiscardPile { get; init; }
    public string WhoseTurn { get; init; }
    public RoundStatus RoundStatus { get; init; }
    public List<PlayerModel> Players { get; init; }
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