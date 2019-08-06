using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Quiddler.Models;

namespace Quiddler.Services
{
    public interface IDictionaryService
    {
        Task<DictionaryModel> CheckWords(IEnumerable<string> words);
    }

    public class DictionaryService : IDictionaryService
    {
        private readonly IHttpClientFactory _clientFactory;
        private readonly IOptions<AppSettings> _settings;
        private readonly IMemoryCache _cache;

        public DictionaryService(IHttpClientFactory clientFactory, IOptions<AppSettings> settings, IMemoryCache cache)
        {
            _clientFactory = clientFactory;
            _settings = settings;
            _cache = cache;
        }

        public async Task<DictionaryModel> CheckWords(IEnumerable<string> words)
        {
            var result = new DictionaryModel();

            foreach (var word in words)
            {
                if (await IsValidWord(word.ToLower().Trim()))
                {
                    result.ValidWords.Add(word);
                }
                else
                {
                    result.InvalidWords.Add(word);
                }
            }

            return result;
        }

        private async Task<bool> IsValidWord(string word)
        {
            if (_cache.TryGetValue<bool>(word, out var valid))
            {
                return valid;
            }

            var client = _clientFactory.CreateClient();

            var request = new HttpRequestMessage(HttpMethod.Get, $"https://owlbot.info/api/v3/dictionary/{word}");

            request.Headers.Authorization = new AuthenticationHeaderValue("Token", _settings.Value.OwlBotToken);

            var response = await client.SendAsync(request);
            valid = response.IsSuccessStatusCode;

            _cache.Set(word, valid);

            return valid;
        }
    }
}