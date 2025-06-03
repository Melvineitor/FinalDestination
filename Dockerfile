# Dockerfile for fullstack: .NET 8 + Angular

# Stage 1: Build Angular
FROM node:20-alpine AS node-build
WORKDIR /app

# Install dependencies first (better caching)
COPY inmo/package*.json ./
RUN npm ci --quiet --no-audit   

# Copy source and build
COPY inmo/angular.json tsconfig*.json ./
COPY inmo/src ./src
COPY inmo/public ./public
RUN npm run build -- --configuration production

# Stage 2: Build .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /source

# Copy and restore project file first (better caching)
COPY inmo/api/*.csproj ./
RUN dotnet restore

# Copy everything else and publish
COPY inmo/api/. ./
RUN dotnet publish -c Release -o /app/publish --no-restore /p:UseAppHost=false

# Stage 3: Production
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app

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

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

EXPOSE 8080
ENTRYPOINT ["dotnet", "api.dll"]
