using System;
using Microsoft.Extensions.DependencyInjection;
using Quiddler.Services;
using Xunit;

namespace Quiddler.Test
{
    public class GameTests : UnitTestBase
    {
        [Fact]
        public async void should_create_game_with_two_players_and_start_first_round()
        {
            var service = ServiceProvider.GetRequiredService<IGameService>();
            var game = await service.Create("Jason");
            game = await service.AddPlayer(game.GameId, "Ann");
            game = await service.StartRound(game.GameId);
        }
    }
}
