using System.Collections.Generic;

namespace Quiddler.Models
{
    public class DictionaryModel
    {
        public DictionaryModel()
        {
            ValidWords = new List<string>();
            InvalidWords = new List<string>();
        }

        public List<string> ValidWords { get; set; }
        public List<string> InvalidWords { get; set; }
    }
}