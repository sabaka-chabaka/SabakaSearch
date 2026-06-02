FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY SabakaSearch.Domain/SabakaSearch.Domain.csproj             SabakaSearch.Domain/
COPY SabakaSearch.Infrastructure/SabakaSearch.Infrastructure.csproj SabakaSearch.Infrastructure/
COPY SabakaSearch.API/SabakaSearch.API.csproj                   SabakaSearch.API/

RUN dotnet restore SabakaSearch.API/SabakaSearch.API.csproj

COPY SabakaSearch.Domain/       SabakaSearch.Domain/
COPY SabakaSearch.Infrastructure/ SabakaSearch.Infrastructure/
COPY SabakaSearch.API/          SabakaSearch.API/

RUN dotnet publish SabakaSearch.API/SabakaSearch.API.csproj \
    -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

USER app

COPY --from=build /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "SabakaSearch.API.dll"]