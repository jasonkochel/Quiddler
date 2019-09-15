using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Amazon.DynamoDBv2;
using Quiddler.Controllers;
using Quiddler.Data;
using Quiddler.Services;

namespace Quiddler.Test
{
    public class UnitTestBase
    {
        protected ServiceProvider ServiceProvider;
        protected UserIdentity Identity;

        public UnitTestBase()
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                .AddEnvironmentVariables();

            var configuration = builder.Build();

            var services = new ServiceCollection();

            services.AddMemoryCache();
            services.AddHttpClient();

            services.AddOptions();
            services.Configure<AppSettings>(configuration);

            services.AddDefaultAWSOptions(configuration.GetAWSOptions());
            services.AddAWSService<IAmazonDynamoDB>();

            services.AddSingleton<IDeckService, MockDeckService>();
            services.AddSingleton<IDictionaryService, DictionaryService>();

            services.AddScoped<UserIdentity, UserIdentity>();
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IGameRepository, GameRepository>();

            ServiceProvider = services.BuildServiceProvider();

            Identity = ServiceProvider.GetRequiredService<UserIdentity>();
        }
    }
}