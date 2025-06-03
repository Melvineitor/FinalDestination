# Dockerfile for fullstack: .NET 8 + Angular

# Stage 1: Build Angular
FROM node:20 AS node-build
WORKDIR /app
COPY inmo/package*.json ./
RUN npm install
COPY inmo/. ./
RUN npm run build

# Stage 2: Build .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY inmo/api/api.csproj ./api/
RUN dotnet restore ./api/api.csproj
COPY inmo/api/. ./api/
WORKDIR /src/api
RUN dotnet publish -c Release -o /app --no-restore

# Stage 3: Production
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app ./
# Copy Angular build to wwwroot
COPY --from=node-build /app/dist/inmo ./wwwroot

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["dotnet", "api.dll"]
