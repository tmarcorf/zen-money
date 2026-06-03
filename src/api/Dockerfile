# ============================================================
# ZenMoney API — .NET 8 Backend
# Multi-stage build: SDK → ASP.NET Runtime (lightweight)
# ============================================================

# ---- Build Stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy only project files first for layer caching (restore)
COPY ZenMoney.API/ZenMoney.API.csproj       ZenMoney.API/
COPY ZenMoney.Application/ZenMoney.Application.csproj ZenMoney.Application/
COPY ZenMoney.Core/ZenMoney.Core.csproj     ZenMoney.Core/
COPY ZenMoney.Infrastructure/ZenMoney.Infrastructure.csproj ZenMoney.Infrastructure/
# Exclude test project from restore — not needed at runtime

# Restore NuGet packages as a distinct layer
RUN dotnet restore ZenMoney.API/ZenMoney.API.csproj

# Copy the rest of the source code
COPY . .

# Publish a self-contained trimmed app in Release mode
RUN dotnet publish ZenMoney.API/ZenMoney.API.csproj \
    -c Release \
    -o /app \
    --no-restore \
    -p:PublishTrimmed=false

# ---- Runtime Stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Install curl for health checks (already available in aspnet:8.0, but explicit)
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy published output from build stage
COPY --from=build /app .

# ASP.NET Core listens on port 8080 by default in container images.
# Make it explicit and enforce HTTP-only (no HTTPS inside the container).
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Non-root user (built into aspnet:8.0 image, uid 1654)
RUN chown -R app:app /app
USER app

EXPOSE 8080

# Health check: the /health endpoint is defined in Program.cs
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -sf http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "ZenMoney.API.dll"]
