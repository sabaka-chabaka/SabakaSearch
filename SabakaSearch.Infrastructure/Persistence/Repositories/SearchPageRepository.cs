using Microsoft.EntityFrameworkCore;
using SabakaSearch.Domain.Entities;
using SabakaSearch.Domain.Repositories;

namespace SabakaSearch.Infrastructure.Persistence.Repositories;

internal sealed class SearchPageRepository : ISearchPageRepository
{
    private readonly SabakaDbContext _db;

    public SearchPageRepository(SabakaDbContext db) => _db = db;

    public async Task<IReadOnlyList<SearchPage>> GetByQueryIdAsync(Guid queryId, CancellationToken ct = default) =>
        await _db.SearchPages
            .Where(p => p.SearchQueryId == queryId)
            .OrderBy(p => p.Position)
            .ToListAsync(ct);

    public async Task AddRangeAsync(IEnumerable<SearchPage> pages, CancellationToken ct = default)
    {
        await _db.SearchPages.AddRangeAsync(pages, ct);
        await _db.SaveChangesAsync(ct);
    }
}