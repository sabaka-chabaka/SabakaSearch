using SabakaSearch.Api.Caching;
using SabakaSearch.Api.DTOs;
using SabakaSearch.Domain.Entities;
using SabakaSearch.Domain.Repositories;

namespace SabakaSearch.Api.Services;

public interface IUserService
{
    Task<UserDto> RegisterAsync(RegisterRequest request, CancellationToken ct = default);
    Task<UserDto?> GetByIdAsync(Guid userId, CancellationToken ct = default);
    Task<IReadOnlyList<UserHistoryDto>> GetHistoryAsync(Guid userId, int limit = 20, CancellationToken ct = default);
}

public sealed class UserService : IUserService
{
    private readonly IUserRepository _userRepo;
    private readonly ISearchQueryRepository _queryRepo;
    private readonly ICacheService _cache;
    private readonly IConfiguration _config;
    private readonly ILogger<UserService> _logger;

    public UserService(
        IUserRepository userRepo,
        ISearchQueryRepository queryRepo,
        ICacheService cache,
        IConfiguration config,
        ILogger<UserService> logger)
    {
        _userRepo  = userRepo;
        _queryRepo = queryRepo;
        _cache     = cache;
        _config    = config;
        _logger    = logger;
    }

    public async Task<UserDto> RegisterAsync(RegisterRequest request, CancellationToken ct = default)
    {
        var exists = await _userRepo.ExistsAsync(request.Email, ct);
        if (exists)
            throw new InvalidOperationException($"Email '{request.Email}' is already registered.");

        var hash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        var user = User.Create(request.Username, request.Email, hash);

        await _userRepo.AddAsync(user, ct);
        _logger.LogInformation("New user registered: {UserId} ({Email})", user.Id, user.Email);

        return MapToDto(user);
    }

    public async Task<UserDto?> GetByIdAsync(Guid userId, CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.User(userId);
        var ttl      = TimeSpan.FromMinutes(_config.GetValue("Cache:UserHistoryTtlMinutes", 2));

        var cached = await _cache.GetAsync<UserDto>(cacheKey, ct);
        if (cached is not null) return cached;

        var user = await _userRepo.GetByIdAsync(userId, ct);
        if (user is null) return null;

        var dto = MapToDto(user);
        await _cache.SetAsync(cacheKey, dto, ttl, ct);
        return dto;
    }

    public async Task<IReadOnlyList<UserHistoryDto>> GetHistoryAsync(
        Guid userId,
        int limit = 20,
        CancellationToken ct = default)
    {
        var cacheKey = CacheKeys.UserHistory(userId, limit);
        var ttl      = TimeSpan.FromMinutes(_config.GetValue("Cache:UserHistoryTtlMinutes", 2));

        var cached = await _cache.GetAsync<List<UserHistoryDto>>(cacheKey, ct);
        if (cached is not null) return cached;

        var queries = await _queryRepo.GetByUserAsync(userId, limit, ct);
        var result  = queries
            .Select(q => new UserHistoryDto(q.Id, q.RawQuery, q.ResultCount, q.CreatedAt))
            .ToList();

        await _cache.SetAsync(cacheKey, result, ttl, ct);
        return result;
    }

    private static UserDto MapToDto(User u) =>
        new(u.Id, u.Username, u.Email, u.CreatedAt, u.LastLoginAt);
}