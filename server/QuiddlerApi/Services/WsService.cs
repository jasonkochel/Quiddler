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
    private readonly ILogger _logger;

    public WsService(IWsConnectionRepository repo, IOptions<AppSettings> settings, ILoggerFactory loggerFactory)
    {
        _repo = repo;
        _logger = loggerFactory.CreateLogger("WebSocketService");
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
            catch (Exception e)
            {
                _logger.LogWarning(e.Message);
            }
        }
    }
}