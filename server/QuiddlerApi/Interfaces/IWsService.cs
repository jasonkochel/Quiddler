namespace QuiddlerApi.Interfaces;

public interface IWsService
{
    Task SendMessageToConnection(string message, string connectionId);
    Task SendMessageToChannel(string message, string channel);
}