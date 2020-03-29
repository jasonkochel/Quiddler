using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Quiddler.Models;
using Newtonsoft.Json;

namespace Quiddler.Services
{
    public interface IAuthService
    {
        UserModel Authenticate(GoogleJsonWebSignaturePayload payload);
        Task<GoogleJsonWebSignaturePayload> ValidateGoogleJwtAsync(string token);
    }

    public class AuthService : IAuthService
    {
        private readonly IHttpClientFactory _clientFactory;

        public AuthService(IHttpClientFactory clientFactory)
        {
            _clientFactory = clientFactory;
        }

        private const string GoogleApiTokenInfoUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={0}";

        public UserModel Authenticate(GoogleJsonWebSignaturePayload payload)
        {
            return new UserModel
            {
                Name = payload.Name,
                Email = payload.Email
            };
        }

        public async Task<GoogleJsonWebSignaturePayload> ValidateGoogleJwtAsync(string token)
        {
            var client = _clientFactory.CreateClient();
            var requestUri = new Uri(string.Format(GoogleApiTokenInfoUrl, token));

            HttpResponseMessage httpResponseMessage;
            try
            {
                httpResponseMessage = await client.GetAsync(requestUri);
            }
            catch (Exception)
            {
                return null;
            }

            if (httpResponseMessage.StatusCode != HttpStatusCode.OK)
            {
                return null;
            }

            var response = httpResponseMessage.Content.ReadAsStringAsync().Result;
            var googleApiTokenInfo = JsonConvert.DeserializeObject<GoogleApiTokenInfo>(response);

            return new GoogleJsonWebSignaturePayload
            {
                Email = googleApiTokenInfo.email,
                GivenName = googleApiTokenInfo.given_name,
                FamilyName = googleApiTokenInfo.family_name,
                Locale = googleApiTokenInfo.locale,
                Name = googleApiTokenInfo.name
            };
        }
    }
}