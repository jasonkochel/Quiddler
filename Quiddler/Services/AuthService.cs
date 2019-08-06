using Quiddler.Models;
using Google.Apis.Auth;

namespace Quiddler.Services
{
    public interface IAuthService
    {
        UserModel Authenticate(GoogleJsonWebSignature.Payload payload);
    }

    public class AuthService : IAuthService
    {
        public UserModel Authenticate(GoogleJsonWebSignature.Payload payload)
        {
            return new UserModel
            {
                Name = payload.Name,
                Email = payload.Email
            };
        }
    }
}