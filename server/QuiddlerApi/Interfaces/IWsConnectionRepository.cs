﻿namespace QuiddlerApi.Interfaces;

public interface IWsConnectionRepository
{
    Task<IEnumerable<string>> GetClients(string id);
    Task DeleteConnection(string channel, string connectionId);
}