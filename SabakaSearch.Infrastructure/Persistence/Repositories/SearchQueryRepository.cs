using Microsoft.EntityFrameworkCore;
using SabakaSearch.Domain.Entities;
using SabakaSearch.Domain.Repositories;

namespace SabakaSearch.Infrastructure.Persistence.Repositories;

internal sealed class SearchQueryRepository : ISearchQueryRepository
{
    private readonly SabakaDbContext _db;

    public SearchQueryRepository(SabakaDbContext db) => _db = db;

    public async Task<SearchQuery?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        await _db.SearchQueries
            .Include(q => q.Pages)
            .FirstOrDefaultAsync(q => q.Id == id, ct);

    public async Task<IReadOnlyList<SearchQuery>> GetByUserAsync(
        Guid userId,
        int limit = 20,
        CancellationToken ct = default) =>
        await _db.SearchQueries
            .Where(q => q.UserId == userId)
            .OrderByDescending(q => q.CreatedAt)
            .Take(limit)
            .ToListAsync(ct);

    public async Task<IReadOnlyList<SearchQuery>> GetPopularAsync(
        int topN,
        TimeSpan window,
        CancellationToken ct = default)
    {
        var since = DateTime.UtcNow - window;

        return await _db.SearchQueries
            .Where(q => q.CreatedAt >= since)
            .GroupBy(q => q.NormalizedQuery)
            .OrderByDescending(g => g.Count())
            .Take(topN)
            .Select(g => g.First())
            .ToListAsync(ct);
    }

    public async Task AddAsync(SearchQuery query, CancellationToken ct = default)
    {
        await _db.SearchQueries.AddAsync(query, ct);
        await _db.SaveChangesAsync(ct);
    }
}