using SabakaSearch.Api.Caching;
using SabakaSearch.Api.DTOs;
using SabakaSearch.Domain.Entities;
using SabakaSearch.Domain.Repositories;

namespace SabakaSearch.Api.Services;

public interface ISearchService
{
    Task<SearchResultDto> SearchAsync(SearchRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<PopularQueryDto>> GetPopularAsync(int topN, int windowMinutes, CancellationToken ct = default);
}

public sealed class SearchService : ISearchService
{
    private readonly ISearchQueryRepository _queryRepo;
    private readonly ISearchPageRepository _pageRepo;
    private readonly ICacheService _cache;
    private readonly IConfiguration _config;
    private readonly ILogger<SearchService> _logger;

    public SearchService(
        ISearchQueryRepository queryRepo,
        ISearchPageRepository pageRepo,
        ICacheService cache,
        IConfiguration config,
        ILogger<SearchService> logger)
    {
        _queryRepo = queryRepo;
        _pageRepo  = pageRepo;
        _cache     = cache;
        _config    = config;
        _logger    = logger;
    }

    public async Task<SearchResultDto> SearchAsync(SearchRequest request, CancellationToken ct = default)
    {
        var normalized = request.Query.Trim().ToLowerInvariant();
        var cacheKey   = CacheKeys.SearchResults(normalized);
        var ttl        = TimeSpan.FromMinutes(_config.GetValue("Cache:SearchResultsTtlMinutes", 10));

        var cached = await _cache.GetAsync<SearchResultDto>(cacheKey, ct);
        if (cached is not null)
        {
            _logger.LogDebug("Cache HIT for query '{Query}'", normalized);
            return cached;
        }

        var sw    = System.Diagnostics.Stopwatch.StartNew();
        var query = SearchQuery.Create(request.Query, request.UserId);

        var pages = GenerateStubResults(query.Id, normalized);

        sw.Stop();
        query.SetResults(pages.Count, sw.Elapsed);
        query.AddPages(pages);

        await _queryRepo.AddAsync(query, ct);
        await _pageRepo.AddRangeAsync(pages, ct);

        var result = MapToDto(query, pages, sw.Elapsed.TotalMilliseconds);

        await _cache.SetAsync(cacheKey, result, ttl, ct);
        _logger.LogDebug("Cache MISS — stored result for '{Query}' (TTL {Ttl})", normalized, ttl);

        return result;
    }

    public async Task<IReadOnlyList<PopularQueryDto>> GetPopularAsync(
        int topN,
        int windowMinutes,
        CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.PopularQueries(windowMinutes);
        var ttl      = TimeSpan.FromMinutes(_config.GetValue("Cache:PopularQueriesTtlMinutes", 5));

        var cached = await _cache.GetAsync<List<PopularQueryDto>>(cacheKey, ct);
        if (cached is not null) return cached;

        var window  = TimeSpan.FromMinutes(windowMinutes);
        var queries = await _queryRepo.GetPopularAsync(topN, window, ct);

        var result = queries
            .Select(q => new PopularQueryDto(q.NormalizedQuery, q.ResultCount))
            .ToList();

        await _cache.SetAsync(cacheKey, result, ttl, ct);
        return result;
    }

    private static List<SearchPage> GenerateStubResults(Guid queryId, string query)
    {
        return Enumerable.Range(1, 5).Select(i =>
            SearchPage.Create(
                queryId,
                url:            $"https://example.com/{Uri.EscapeDataString(query)}/{i}",
                $"Result #{i} for \"{query}\"",
                snippet:        $"This page is about {query} — entry number {i}.",
                relevanceScore: Math.Round(1.0 - (i - 1) * 0.15, 2),
                position:       i
            )).ToList();
    }

    private static SearchResultDto MapToDto(SearchQuery query, List<SearchPage> pages, double elapsedMs) =>
        new(
            QueryId:     query.Id,
            RawQuery:    query.RawQuery,
            ResultCount: query.ResultCount,
            ExecutionMs: Math.Round(elapsedMs, 2),
            Pages: pages.Select(p => new SearchPageDto(
                p.Id, p.Url, p.Title, p.Snippet, p.RelevanceScore, p.Position
            )).ToList()
        );
}