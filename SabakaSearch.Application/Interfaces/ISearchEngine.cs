using SabakaSearch.Application.DTOs;

namespace SabakaSearch.Application.Interfaces;

public interface ISearchEngine
{
    Task<IReadOnlyList<PageResult>> SearchAsync(string query, CancellationToken ct = default);
}