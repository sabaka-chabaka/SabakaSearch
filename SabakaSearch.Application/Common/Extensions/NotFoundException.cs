namespace SabakaSearch.Application.Common.Extensions;

public sealed class NotFoundException : Exception
{
    public NotFoundException(string entity, object key) : base($"{entity} with key '{key}' was not found.") { }
}