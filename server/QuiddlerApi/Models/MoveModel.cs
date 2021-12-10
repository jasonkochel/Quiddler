namespace QuiddlerApi.Models;

public record MoveModel
{
    public MoveType Type { get; init; }
    public string Discard { get; init; }
    public List<List<CardModel>> Words { get; init; }
}

public enum MoveType
{
    DrawFromDiscard,
    DrawFromShoe,
    Discard,
    GoOut,
    ReadyForNextRound
}