namespace SabakaSearch.Application.DTOs;

public sealed record UserDto(
    Guid Id,
    string Username,
    string Email,
    DateTime CreatedAt,
    DateTime? LastLoginAt);

public sealed record SearchResultDto(
    Guid QueryId,
    string RawQuery,
    int ResultCount,
    TimeSpan ExecutionTime,
    IReadOnlyList<SearchPageDto> Pages);

public sealed record SearchPageDto(
    string Url,
    string Title,
    string Snippet,
    int Position,
    double RelevanceScore);

public sealed record PageResult(
    string Url,
    string Title,
    string Snippet,
    double RelevanceScore);