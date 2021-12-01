using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using QuiddlerApi.Interfaces;

namespace QuiddlerApi.Data;

public class WsConnectionRepository : IWsConnectionRepository
{
    private readonly DynamoDBContext _db;

    public WsConnectionRepository(IAmazonDynamoDB client)
    {
        _db = new DynamoDBContext(client, new DynamoDBContextConfig
        {
            Conversion = DynamoDBEntryConversion.V2
        });
    }

    public async Task<IEnumerable<string>> GetClients(string id)
    {
        var clients = await _db.QueryAsync<WsConnection>(id).GetRemainingAsync();
        return clients.Select(c => c.ConnectionId);
    }

    public async Task DeleteConnection(string channel, string connectionId)
    {
        await _db.DeleteAsync<WsConnection>(channel, connectionId);
    }
}