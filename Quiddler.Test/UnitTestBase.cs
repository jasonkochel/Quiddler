using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Net.Http;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.EntityFrameworkCore;
using Quiddler.Data;
using Quiddler.Services;

namespace Quiddler.Test
{
    public class UnitTestBase
    {
        protected ServiceProvider ServiceProvider;

        public UnitTestBase()
        {
            var builder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                .AddEnvironmentVariables();

            var configuration = builder.Build();

            var services = new ServiceCollection();
            services.AddDefaultAWSOptions(configuration.GetAWSOptions());
            services.AddAWSService<IAmazonDynamoDB>();

            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IGameRepository, GameRepository>();

            ServiceProvider = services.BuildServiceProvider();
        }
    }
}