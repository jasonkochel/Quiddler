// ReSharper disable StringLiteralTypo

using System.Collections.Generic;
using Microsoft.Extensions.DependencyInjection;
using Quiddler.Models;
using Quiddler.Services;
using Xunit;

namespace Quiddler.Test
{
    public class DictionaryTests : UnitTestBase
    {
        private readonly IDictionaryService _service;

        public DictionaryTests()
        {
            _service = ServiceProvider.GetRequiredService<IDictionaryService>();
        }

        [Fact]
        public async void should_return_valid_and_invalid_words()
        {
            // arrange
            string[] input = {"this", "that", "theother"};
            var expected = new DictionaryModel
            {
                ValidWords = new List<string> {"this", "that"},
                InvalidWords = new List<string> {"theother"}
            };

            // act
            var result = await _service.CheckWords(input);

            // assert
            Assert.Equal(result.ValidWords, expected.ValidWords);
            Assert.Equal(result.InvalidWords, expected.InvalidWords);
        }
    }
}
