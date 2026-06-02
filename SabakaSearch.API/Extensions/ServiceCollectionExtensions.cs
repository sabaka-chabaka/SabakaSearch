using Microsoft.EntityFrameworkCore;
using SabakaSearch.Api.Caching;
using SabakaSearch.Api.Services;
using SabakaSearch.Infrastructure.Persistence;

namespace SabakaSearch.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddRedisCache(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var redisConnection = configuration.GetConnectionString("Redis")
                              ?? throw new InvalidOperationException("Redis connection string 'Redis' is not configured.");

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConnection;
            options.InstanceName = "sabaka:";
        });

        services.AddSingleton<ICacheService, RedisCacheService>();

        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ISearchService, SearchService>();
        services.AddScoped<IUserService, UserService>();

        return services;
    }
}

public static class WebApplicationExtensions
{
    public static async Task ApplyMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<SabakaDbContext>();
        await db.Database.MigrateAsync();
    }
}