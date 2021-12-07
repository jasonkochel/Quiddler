namespace QuiddlerApi.Models;

public record PlayerModel
{
    public string Name { get; init; }
    public List<CardModel> Hand { get; init; }
    public List<List<CardModel>> Words { get; init; }
    public int TotalScore { get; init; }
    public int RoundScore { get; init; }
    public bool HasGoneOut { get; init; }
    public bool ReadyForNextRound { get; init; }
}
