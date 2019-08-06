using System;
using Microsoft.Extensions.DependencyInjection;
using Quiddler.Models;
using Quiddler.Services;
using Xunit;

namespace Quiddler.Test
{
    public class GameTests : UnitTestBase
    {
        private readonly IGameService _service;

        public GameTests()
        {
            _service = ServiceProvider.GetRequiredService<IGameService>();
        }

        [Fact]
        public async void should_create_game_with_two_players_and_start_first_round()
        {
            var game = await _service.Create("Jason");
            game = await _service.AddPlayer(game.GameId, "Ann");
            game = await _service.StartRound(game.GameId);
            await _service.Delete(game.GameId);
        }

        [Fact]
        public async void should_play_a_round()
        {
            var game = await _service.Create("Jason");
            var gameId = game.GameId;

            await _service.AddPlayer(gameId, "Ann");
            await _service.StartRound(gameId);

            await _service.MakeMove(gameId, new MoveModel { Type = MoveType.DrawFromShoe });
            await _service.MakeMove(gameId, new MoveModel { Type = MoveType.Discard, Discard = "X" });

            await _service.MakeMove(gameId, new MoveModel { Type = MoveType.DrawFromDiscard });
            await _service.MakeMove(gameId, new MoveModel { Type = MoveType.Discard, Discard = "Y" });

            await _service.Delete(gameId);
        }
    }
}
