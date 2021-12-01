namespace QuiddlerApi.Models;

public class PlayerModel
{
    public string Name { get; set; }
    public List<CardModel> Hand { get; set; }
    public List<List<CardModel>> Words { get; set; }
    public int TotalScore { get; set; }
    public int RoundScore { get; set; }
    public bool HasGoneOut { get; set; }
    public bool ReadyForNextRound { get; set; }
}
