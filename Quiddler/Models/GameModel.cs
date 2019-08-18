using System;
using System.Collections.Generic;
using System.Linq;
using Quiddler.Data;

namespace Quiddler.Models
{

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
        public string TopOfDiscardPile { get; set; }
        public string WhoseTurn { get; set; }
        public string WhoIsGoingOut { get; set; }
        public List<PlayerModel> Players { get; set; }
    }

    public static class Mapper
    {
        public static GameListModel MapEntityToListModel(Game game)
        {
            return new GameListModel
            {
                GameId = game.GameId,
                CreatedAt = game.CreatedAt,
                HasStarted = game.Round != null,
                Round = game.Round + 2,
                WhoseTurn = game.Players[game.Turn].Name,
                Players = game.Players.Select(p => p.Name).ToList()
            };
        }

        public static GameModel MapEntityToModel(Game game, string myName)
        {
            return new GameModel
            {
                GameId = game.GameId,
                CardsInRound = game.Round + 2 ?? 0,
                TopOfDiscardPile = game.DiscardPile == null || game.DiscardPile.Count == 0 ? null : game.DiscardPile.Peek(),
                WhoIsGoingOut = game.Players.FirstOrDefault(p => p.IsGoingOut)?.Name,
                WhoseTurn = game.Players[game.Turn].Name,
                Players = game.Players.Select(p => new PlayerModel
                {
                    Name = p.Name,
                    IsGoingOut = p.IsGoingOut,
                    Hand = p.Name == myName ? p.Hand : null,
                    Score = p.Scores?.Sum(s => s) ?? 0,
                    Words = p.Words
                }).ToList()
            };
        }
    }
}