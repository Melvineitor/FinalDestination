# Dockerfile for fullstack: .NET 9 + Angular

# Stage 1: Build Angular
FROM node:20.11.1-alpine3.19 AS node-build
WORKDIR /app

# Install dependencies first (better caching)
COPY inmo/package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --quiet --no-audit

# Copy source and build
COPY inmo/angular.json ./
COPY inmo/tsconfig*.json ./
COPY inmo/src ./src
COPY inmo/public ./public
RUN npm run build -- --configuration production

# Stage 2: Build .NET
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

# Copy and restore project file first (better caching)
COPY ["inmo/api/api.csproj", "./"]
RUN dotnet restore "./api.csproj"

# Copy everything else and build
COPY inmo/api/. ./
RUN dotnet publish "api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Production
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS final
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Add non-root user for security
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

# Copy published app and frontend
COPY --from=build --chown=appuser:appuser /app/publish ./
COPY --from=node-build --chown=appuser:appuser /app/dist/inmo ./wwwroot/

# Configure ASP.NET Core
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV TZ=UTC
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1

# Health check using curl instead of wget
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

EXPOSE 8080
ENTRYPOINT ["dotnet", "api.dll"]
