namespace SabakaSearch.Domain.Entities;

public class SearchQuery
{
    public Guid Id { get; private set; }
    public Guid? UserId { get; private set; }
    public string RawQuery { get; private set; } = default!;
    public string NormalizedQuery { get; private set; } = default!;
    public int ResultCount { get; private set; }
    public TimeSpan ExecutionTime { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public User? User { get; private set; }

    private readonly List<SearchPage> _pages = new();
    public IReadOnlyCollection<SearchPage> Pages => _pages.AsReadOnly();

    private SearchQuery() { }

    public static SearchQuery Create(string rawQuery, Guid? userId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(rawQuery);

        return new SearchQuery
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            RawQuery = rawQuery.Trim(),
            NormalizedQuery = rawQuery.Trim().ToLowerInvariant(),
            CreatedAt = DateTime.UtcNow
        };
    }

    public void SetResults(int resultCount, TimeSpan executionTime)
    {
        if (resultCount < 0)
            throw new ArgumentOutOfRangeException(nameof(resultCount));

        ResultCount = resultCount;
        ExecutionTime = executionTime;
    }

    public void AddPages(IEnumerable<SearchPage> pages) =>
        _pages.AddRange(pages);
}