using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;

namespace QuiddlerApi.Data;

[DynamoDBTable("QuiddlerGames")]
public class Game
{
    [DynamoDBHashKey]
    public string GameId { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<Player> Players { get; set; }

    [DynamoDBProperty(typeof(StringStackConverter))]
    public Stack<string> Deck { get; set; }

    [DynamoDBProperty(typeof(StringStackConverter))]
    public Stack<string> DiscardPile { get; set; }

    public int? Round { get; set; }
    public int Turn { get; set; }
}

public class Player
{
    public Player()
    {
        Scores = new int[8];
    }

    public string Name { get; set; }
    public List<string> Hand { get; set; }

    [DynamoDBProperty(typeof(IntArrayConverter))]
    public int[] Scores { get; set; }

    public bool IsGoingOut { get; set; }
    public List<string> Words { get; set; }
}

public class StringStackConverter : IPropertyConverter
{
    public DynamoDBEntry ToEntry(object value)
    {
        if (!(value is Stack<string> stack))
        {
            return new DynamoDBNull();
        }

        return new DynamoDBList(stack.Select(i => new Primitive(i)).ToList());
    }

    public object FromEntry(DynamoDBEntry entry)
    {
        var serializedStack = entry.AsListOfString();
        serializedStack.Reverse();  // Dynamo returns it "upside-down"
        return new Stack<string>(serializedStack);
    }
}

public class IntArrayConverter : IPropertyConverter
{
    public DynamoDBEntry ToEntry(object value)
    {
        if (!(value is int[] array))
        {
            return new DynamoDBNull();
        }

        return new DynamoDBList(array.Select(i => new Primitive(i.ToString(), true)).ToList());
    }

    public object FromEntry(DynamoDBEntry entry)
    {
        var serialized = entry.AsListOfDynamoDBEntry();
        return serialized.Select(i => i.AsInt()).ToArray();
    }
}