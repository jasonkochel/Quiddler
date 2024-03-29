﻿using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using QuiddlerApi.Interfaces;

namespace QuiddlerApi.Data;

public class GameRepository : IGameRepository
{
    private readonly DynamoDBContext _db;

    public GameRepository(IAmazonDynamoDB client)
    {
        _db = new DynamoDBContext(client, new DynamoDBContextConfig
        {
            Conversion = DynamoDBEntryConversion.V2
        });
    }

    public async Task<IEnumerable<Game>> GetAll()
    {
        return await _db.ScanAsync<Game>(new List<ScanCondition>()).GetRemainingAsync();
    }

    public async Task<Game> Get(string id)
    {
        return await _db.LoadAsync<Game>(id);
    }

    public async Task<string> Create(Game game)
    {
        game.GameId = Guid.NewGuid().ToString();
        game.CreatedAt = DateTime.Now;

        await _db.SaveAsync(game);

        return game.GameId;
    }

    public async Task Update(Game game)
    {
        await _db.SaveAsync(game);
    }

    public async Task Delete(string id)
    {
        await _db.DeleteAsync<Game>(id);
    }
}