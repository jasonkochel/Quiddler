namespace QuiddlerApi.Models;

public class MoveModel
{
    public MoveType Type { get; set; }
    public string Discard { get; set; }
    public List<List<CardModel>> Words { get; set; }
}

public enum MoveType
{
    DrawFromDiscard,
    DrawFromShoe,
    Discard,
    GoOut,
    ReadyForNextRound
}