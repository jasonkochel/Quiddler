using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quiddler.Models;
using Quiddler.Services;

namespace Quiddler.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [IdentityFilter]
    public class GamesController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IDictionaryService _dictionaryService;

        public GamesController(IGameService gameService, IDictionaryService dictionaryService)
        {
            _gameService = gameService;
            _dictionaryService = dictionaryService;
        }

        [HttpGet]
        public async Task<IEnumerable<GameListModel>> Get()
        {
            return await _gameService.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<GameModel> Get(string id)
        {
            return await _gameService.Get(id);
        }

        [HttpPost]
        public async Task<GameModel> Post()
        {
            return await _gameService.Create();
        }

        [HttpPost("{id}/players")]
        public async Task<GameModel> AddPlayer(string id, [FromQuery] bool startGame)
        {
            var gameModel = await _gameService.AddPlayer(id);

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
