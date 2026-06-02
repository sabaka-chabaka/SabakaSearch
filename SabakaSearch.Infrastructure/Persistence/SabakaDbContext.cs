using Microsoft.EntityFrameworkCore;
using SabakaSearch.Domain.Entities;

namespace SabakaSearch.Infrastructure.Persistence;

public class SabakaDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<SearchQuery> SearchQueries => Set<SearchQuery>();
    public DbSet<SearchPage> SearchPages => Set<SearchPage>();
    
    public SabakaDbContext(DbContextOptions<SabakaDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SabakaDbContext).Assembly);
    }
}