namespace SabakaSearch.Api.Caching;

public static class CacheKeys
{
    public static string SearchResults(string normalizedQuery) =>
        $"search:{normalizedQuery}";

    public static string PopularQueries(int windowMinutes) =>
        $"popular:{windowMinutes}m";

    public static string UserHistory(Guid userId, int limit) =>
        $"user_history:{userId}:{limit}";

    public static string User(Guid userId) =>
        $"user:{userId}";
}