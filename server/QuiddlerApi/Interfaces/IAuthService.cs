using QuiddlerApi.Models;

namespace QuiddlerApi.Interfaces;

public interface IAuthService
{
    UserModel Authenticate(GoogleJsonWebSignaturePayload payload);
    Task<GoogleJsonWebSignaturePayload> ValidateGoogleJwtAsync(string token);
}