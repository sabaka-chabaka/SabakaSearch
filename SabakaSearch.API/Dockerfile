FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY SabakaSearch.Domain/SabakaSearch.Domain.csproj             SabakaSearch.Domain/
COPY SabakaSearch.Infrastructure/SabakaSearch.Infrastructure.csproj SabakaSearch.Infrastructure/
COPY SabakaSearch.Api/SabakaSearch.Api.csproj                   SabakaSearch.Api/

RUN dotnet restore SabakaSearch.Api/SabakaSearch.Api.csproj

COPY SabakaSearch.Domain/       SabakaSearch.Domain/
COPY SabakaSearch.Infrastructure/ SabakaSearch.Infrastructure/
COPY SabakaSearch.Api/          SabakaSearch.Api/

RUN dotnet publish SabakaSearch.Api/SabakaSearch.Api.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

RUN adduser --disabled-password --no-create-home appuser && chown appuser /app
USER appuser

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "SabakaSearch.Api.dll"]