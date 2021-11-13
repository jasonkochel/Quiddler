using System.Text;
using System.Text.Json.Serialization;
using Amazon.ApiGatewayManagementApi;
using Amazon.DynamoDBv2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using QuiddlerApi.Controllers;
using QuiddlerApi.Data;
using QuiddlerApi.Interfaces;
using QuiddlerApi.Models;
using QuiddlerApi.Services;

namespace QuiddlerApi;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddMvc().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        });

        services.AddControllers();
        services.AddMemoryCache();
        services.AddHttpClient();

        services.AddOptions();
        services.Configure<AppSettings>(Configuration);

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;

                cfg.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtSecret"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

        services.AddDefaultAWSOptions(Configuration.GetAWSOptions());
        services.AddAWSService<IAmazonDynamoDB>();

        services.AddSingleton<IDeckService, DeckService>();
        services.AddSingleton<IDictionaryService, DictionaryService>();
        services.AddSingleton<GameMapper, GameMapper>();

        services.AddScoped<UserIdentity, UserIdentity>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IGameService, GameService>();
        services.AddScoped<IWsService, WsService>();

        services.AddScoped<IGameRepository, GameRepository>();
        services.AddScoped<IWsConnectionRepository, WsConnectionRepository>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
        app.UseRouting();

        app.UseAuthentication();
        app.UseAuthorization();
            
        app.UseHttpsRedirection();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}