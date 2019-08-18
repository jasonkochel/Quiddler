using System.Collections.Generic;

namespace Quiddler.Models
{
    public class MoveModel
    {
        public MoveType Type { get; set; }
        public string Discard { get; set; }
        public IEnumerable<string> Words { get; set; }
    }

    public enum MoveType
    {
        DrawFromDiscard,
        DrawFromShoe,
        Discard,
        GoOut
    }
}