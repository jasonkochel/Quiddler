using System.Collections.Generic;
using System.Linq;
using Quiddler.Data;

namespace Quiddler.Models
{
    public class GameModel
    {
        public string GameId { get; set; }
        public int CardsInRound { get; set; }
        public string WhoseTurn { get; set; }
        public string WhoIsGoingOut { get; set; }
        public List<PlayerModel> Players { get; set; }
    }

    public static partial class Mapper
    {
        public static GameModel MapEntityToModel(Game game)
        {
            return new GameModel
            {
                GameId = game.GameId,
                CardsInRound = game.Round + 2,
                WhoIsGoingOut = game.Players.FirstOrDefault(p => p.IsGoingOut)?.Name,
                WhoseTurn = game.Players[game.Turn].Name,
                Players = game.Players.Select(p => new PlayerModel
                {
                    Name = p.Name,
                    IsGoingOut = p.IsGoingOut,
                    Hand = p.Hand,
                    Score = p.Scores?.Sum(s => s.Value) ?? 0
                }).ToList()
            };
        }
    }
}