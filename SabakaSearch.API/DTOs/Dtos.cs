namespace SabakaSearch.Api.DTOs;

public sealed record SearchRequest(string Query, Guid? UserId = null);

public sealed record SearchResultDto(
    Guid QueryId,
    string RawQuery,
    int ResultCount,
    double ExecutionMs,
    IReadOnlyList<SearchPageDto> Pages);

public sealed record SearchPageDto(
    Guid Id,
    string Url,
    string Title,
    string Snippet,
    double RelevanceScore,
    int Position);

public sealed record PopularQueryDto(string Query, int Count);

public sealed record RegisterRequest(string Username, string Email, string Password);

public sealed record UserDto(Guid Id, string Username, string Email, DateTime CreatedAt, DateTime? LastLoginAt);

public sealed record UserHistoryDto(Guid QueryId, string RawQuery, int ResultCount, DateTime CreatedAt);

public sealed record ErrorResponse(string Error, string? Detail = null);