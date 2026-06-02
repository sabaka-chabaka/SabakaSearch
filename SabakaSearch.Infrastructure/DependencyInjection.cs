using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SabakaSearch.Domain.Repositories;
using SabakaSearch.Infrastructure.Persistence;
using SabakaSearch.Infrastructure.Persistence.Repositories;

namespace SabakaSearch.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration config)
    {
        services.AddDbContext<SabakaDbContext>(opts =>
            opts.UseNpgsql(
                config.GetConnectionString("Postgres"),
                npgsql => npgsql.MigrationsAssembly(typeof(SabakaDbContext).Assembly.FullName)
            ));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ISearchQueryRepository, SearchQueryRepository>();
        services.AddScoped<ISearchPageRepository, SearchPageRepository>();

        return services;
    }
}