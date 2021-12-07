namespace QuiddlerApi.Models;

public record CardModel
{
    public string CardId { get; init; }
    public string Letter { get; init; }
    public int Value { get; init; }
}