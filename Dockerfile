# Dockerfile para proyecto fullstack: .NET 9 + Angular

# Etapa 1: Build Angular
FROM node:20 AS node-build
WORKDIR /app/angular
COPY inmo/package*.json ./
RUN npm install
COPY inmo/. ./
RUN npm run build -- --output-path=dist

# Etapa 2: Build .NET
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY inmo/api/api.csproj ./api/
RUN dotnet restore ./api/api.csproj
COPY inmo/api/. ./api/
WORKDIR /src/api
RUN dotnet publish -c Release -o /app --no-restore

# Etapa 3: Producción
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app ./
# Copia el build de Angular al wwwroot del backend
COPY --from=node-build /app/angular/dist ./wwwroot

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "api.dll"]
