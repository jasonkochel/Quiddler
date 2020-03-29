using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Quiddler.Models;
using Quiddler.Services;

namespace Quiddler.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IOptions<AppSettings> _appSettings;

        public AuthController(IAuthService authService, IOptions<AppSettings> appSettings)
        {
            _authService = authService;
            _appSettings = appSettings;
        }

        [AllowAnonymous]
        [HttpPost("google")]
        public async Task<IActionResult> Google([FromBody]UserView userView)
        {
            try
            {
                var payload = await _authService.ValidateGoogleJwtAsync(userView.tokenId);
                var user = _authService.Authenticate(payload);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("name", payload.GivenName)
                };

                var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Value.JwtSecret));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken("",
                    "",
                    claims,
                    expires: DateTime.Now.AddDays(30),
                    signingCredentials: creds);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });
            }
            catch (Exception ex)
            {
                BadRequest(ex.Message);
            }
            return BadRequest();
        }
    }
}