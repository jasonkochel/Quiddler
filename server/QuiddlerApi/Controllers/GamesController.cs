using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuiddlerApi.Interfaces;
using QuiddlerApi.Models;

namespace QuiddlerApi.Controllers;

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
    public async Task<IEnumerable<GameListModel>> GetGameList()
    {
        return await _gameService.GetAll();
    }

    [HttpGet("{id}")]
    public async Task<GameModel> GetGame(string id)
    {
        return await _gameService.Get(id);
    }

    [HttpPost]
    public async Task<IEnumerable<GameListModel>> CreateGame()
    {
        await _gameService.Create();
        return await GetGameList();
    }

    [HttpDelete("{id}")]
    public async Task<IEnumerable<GameListModel>> DeleteGame(string id)
    {
        await _gameService.Delete(id);
        return await GetGameList();
    }

    [HttpPost("{id}/players")]
    public async Task<IEnumerable<GameListModel>> AddPlayer(string id)
    {
        await _gameService.AddPlayer(id);
        return await GetGameList();
    }

    [HttpPost("{id}/start")]
    public async Task<IEnumerable<GameListModel>> StartGame(string id)
    {
        await _gameService.StartRound(id);
        return await GetGameList();
    }

    [HttpPut("{id}")]
    public async Task<GameModel> Put(string id, [FromBody] MoveModel move)
    {
        return await _gameService.MakeMove(id, move);
    }

    [HttpPut("{id}/hand")]
    public async Task<GameModel> SortHand(string id, [FromQuery] string newHand)
    {
        return await _gameService.SortHand(id, newHand);
    }

    [HttpGet("dictionary")]
    public async Task<DictionaryModel> CheckWords([FromQuery] string words)
    {
        return await _dictionaryService.CheckWords(words.Split(','));
    }
}