using System;
using System.Collections.Generic;
using System.Linq;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;

namespace Quiddler.Data
{
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

        public int Round { get; set; }
        public int Turn { get; set; }
    }

    public class Player
    {
        public string Name { get; set; }
        public List<string> Hand { get; set; }
        public Dictionary<int, int> Scores { get; set; }
        public bool IsGoingOut { get; set; }
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
            return new Stack<string>(entry.AsListOfString());
        }
    }
}
