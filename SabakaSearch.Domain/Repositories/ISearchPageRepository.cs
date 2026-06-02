using SabakaSearch.Domain.Entities;

namespace SabakaSearch.Domain.Repositories;

public interface ISearchPageRepository
{
    Task<IReadOnlyList<SearchPage>> GetByQueryIdAsync(Guid queryId, CancellationToken ct = default);
    Task AddRangeAsync(IEnumerable<SearchPage> pages, CancellationToken ct = default);
}