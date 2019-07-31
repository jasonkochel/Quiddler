using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Quiddler.Models;
using Quiddler.Services;

namespace Quiddler.Controllers
{
    [Route("api")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("{id}")]
        public ActionResult<string> Get(string id)
        {
            return "value";
        }

        [HttpPost("{name}")]
        public async Task<GameModel> Post(string name)
        {
            return await _gameService.Create(name);
        }

        [HttpPost("{id}/players/{name}")]
        public async Task<GameModel> AddPlayer(string id, string name)
        {
            return await _gameService.AddPlayer(id, name);
        }

        [HttpPut("{id}")]
        public async Task<GameModel> Put(string id)
        {
            return await _gameService.StartRound(id);
        }
    }
}
