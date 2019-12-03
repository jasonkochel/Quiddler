using System.Text;
using Amazon.DynamoDBv2;
using Lib.AspNetCore.ServerSentEvents;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Converters;
using Quiddler.Controllers;
using Quiddler.Data;
using Quiddler.Services;
using Microsoft.Extensions.Hosting;
using Quiddler.Models;

namespace Quiddler
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().AddNewtonsoftJson(options =>
            {
                options.SerializerSettings.Converters.Add(new StringEnumConverter());
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            services.AddControllers();
            services.AddMemoryCache();
            services.AddHttpClient();
            services.AddServerSentEvents();

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
            services.AddScoped<IGameService, GameService>();
            services.AddScoped<IGameRepository, GameRepository>();
            services.AddScoped<IAuthService, AuthService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); //.AllowCredentials());
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseHttpsRedirection();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapServerSentEvents("/sse");
                endpoints.MapControllers();
            });
        }
    }
}
