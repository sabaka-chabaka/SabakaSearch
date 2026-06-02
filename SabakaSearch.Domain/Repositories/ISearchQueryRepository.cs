using SabakaSearch.Domain.Entities;

namespace SabakaSearch.Domain.Repositories;

public interface ISearchQueryRepository
{
    Task<SearchQuery?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<SearchQuery>> GetByUserAsync(Guid userId, int limit = 20, CancellationToken ct = default);
    Task<IReadOnlyList<SearchQuery>> GetPopularAsync(int topN, TimeSpan window, CancellationToken ct = default);
    Task AddAsync(SearchQuery query, CancellationToken ct = default);
}