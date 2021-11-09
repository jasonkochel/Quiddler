namespace QuiddlerApi.Models;

public class PlayerModel
{
    public string Name { get; set; }
    public bool IsGoingOut { get; set; }
    public List<CardModel> Hand { get; set; }
    public List<string> Words { get; set; }
    public int Score { get; set; }
}