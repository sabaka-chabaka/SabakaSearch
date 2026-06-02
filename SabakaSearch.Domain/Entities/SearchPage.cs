namespace SabakaSearch.Domain.Entities;

public class SearchPage
{
    public Guid Id { get; private set; }
    public Guid SearchQueryId { get; private set; }
    public string Url { get; private set; } = default!;
    public string Title { get; private set; } = default!;
    public string Snippet { get; private set; } = default!;
    public double RelevanceScore { get; private set; }
    public int Position { get; private set; }
    public DateTime IndexedAt { get; private set; }

    public SearchQuery SearchQuery { get; private set; } = default!;

    private SearchPage() { }

    public static SearchPage Create(
        Guid searchQueryId,
        string url,
        string title,
        string snippet,
        double relevanceScore,
        int position)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(url);
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        if (relevanceScore is < 0 or > 1)
            throw new ArgumentOutOfRangeException(nameof(relevanceScore), "Score must be between 0 and 1.");

        if (position < 1)
            throw new ArgumentOutOfRangeException(nameof(position), "Position is 1-based.");

        return new SearchPage
        {
            Id = Guid.NewGuid(),
            SearchQueryId = searchQueryId,
            Url = url,
            Title = title,
            Snippet = snippet,
            RelevanceScore = relevanceScore,
            Position = position,
            IndexedAt = DateTime.UtcNow
        };
    }
}
