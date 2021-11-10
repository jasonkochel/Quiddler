using System.Text.Json;
using QuiddlerApi.Interfaces;
using QuiddlerApi.Models;

namespace QuiddlerApi.Services;

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

        var httpResponseMessage = await client.GetAsync(requestUri);

        httpResponseMessage.EnsureSuccessStatusCode();

        var response = await httpResponseMessage.Content.ReadAsStringAsync();
        var googleApiTokenInfo = JsonSerializer.Deserialize<GoogleApiTokenInfo>(response);

        if (googleApiTokenInfo == null)
        {
            throw new Exception("Unexpected response from Google tokeninfo endpoint");
        }

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