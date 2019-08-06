using System.Collections.Generic;
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
        private readonly IDictionaryService _dictionaryService;

        public GameController(IGameService gameService, IDictionaryService dictionaryService)
        {
            _gameService = gameService;
            _dictionaryService = dictionaryService;
        }

        [HttpGet]
        public async Task<IEnumerable<GameModel>> Get()
        {
            return await _gameService.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<GameModel> Get(string id)
        {
            return await _gameService.Get(id);
        }

        [HttpPost("{name}")]
        public async Task<GameModel> Post(string name)
        {
            return await _gameService.Create(name);
        }

        [HttpPost("{id}/players/{name}")]
        public async Task<GameModel> AddPlayer(string id, string name, [FromQuery] bool startGame)
        {
            var gameModel = await _gameService.AddPlayer(id, name);

            if (startGame)
            {
                return await _gameService.StartRound(id);
            }

            return gameModel;
        }

        [HttpPut("{id}")]
        public async Task<GameModel> Put(string id, [FromBody] MoveModel move)
        {
            return await _gameService.MakeMove(id, move);
        }

        [HttpGet("dictionary")]
        public async Task<DictionaryModel> CheckWords([FromQuery] string words)
        {
            return await _dictionaryService.CheckWords(words.Split(','));
        }
    }
}
