# Use the official .NET SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj and restore as distinct layers
COPY api/api.csproj ./api/
RUN dotnet restore ./api/api.csproj

# Copy the rest of the source code
COPY api/. ./api/
WORKDIR /src/api

# Publish the application to the /app folder
RUN dotnet publish -c Release -o /app --no-restore

# Use the official .NET runtime image for running the app
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app ./

# Set environment variables for Railway
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
ENV PORT=8080

# Expose port 8080 for Railway
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "api.csproj"]
