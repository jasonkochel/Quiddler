using System.Text;
using Amazon.ApiGatewayManagementApi;
using Amazon.ApiGatewayManagementApi.Model;
using Microsoft.Extensions.Options;
using QuiddlerApi.Interfaces;

namespace QuiddlerApi.Services;

public class WsService : IWsService
{
    private readonly IWsConnectionRepository _repo;
    private readonly IAmazonApiGatewayManagementApi _apiGateway;

    public WsService(IWsConnectionRepository repo, IOptions<AppSettings> settings)
    {
        _repo = repo;
        _apiGateway = new AmazonApiGatewayManagementApiClient(new AmazonApiGatewayManagementApiConfig
        {
            ServiceURL = settings.Value.WsUrl
        });
    }

    public async Task SendMessageToConnection(string message, string connectionId)
    {
        await _apiGateway.PostToConnectionAsync(new PostToConnectionRequest
        {
            ConnectionId = connectionId,
            Data = new MemoryStream(Encoding.ASCII.GetBytes(message))
        });
    }

    public async Task SendMessageToChannel(string message, string channel)
    {
        var connections = await _repo.GetClients(channel);
        foreach (var connectionId in connections)
        {
            try
            {
                await SendMessageToConnection(message, connectionId);
            }
            catch (GoneException)
            {
                await _repo.DeleteConnection(channel, connectionId);
            }
        }
    }
}