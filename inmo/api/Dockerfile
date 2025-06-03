FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src


COPY ["api.csproj", "./"]
RUN dotnet restore


COPY . .
RUN dotnet build "api.csproj" -c Release -o /app/build
RUN dotnet publish "api.csproj" -c Release -o /app/publish /p:UseAppHost=false


FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "api.dll"]