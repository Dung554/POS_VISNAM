# =========================
# 1) Build Frontend
# =========================
FROM node:20-alpine AS fe-build
WORKDIR /app

# Copy FE and install deps
COPY FE/pos_visnam ./FE/pos_visnam
WORKDIR /app/FE/pos_visnam

# Use npm ci if lockfile exists; fallback to npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Build (works for Vite/React build setups; if your FE uses CRA, change to: npm run build)
RUN npm run build

# =========================
# 2) Build Backend
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS be-build
WORKDIR /src

# Copy backend source
COPY BE/POS_VISNAM ./BE/POS_VISNAM

# Restore + publish
WORKDIR /src/BE/POS_VISNAM
RUN dotnet restore
RUN dotnet publish POS_VISNAM/POS_VISNAM.csproj -c Release -o /out /p:UseAppHost=false

# =========================
# 3) Runtime (serve API + static FE)
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Kestrel listen on 8080 inside container
ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

# Copy published backend
COPY --from=be-build /out ./

# Copy built frontend into wwwroot so ASP.NET can serve it as static files
# Vite default output: dist
# CRA default output: build
COPY --from=fe-build /app/FE/pos_visnam/dist ./wwwroot

# Start backend
ENTRYPOINT ["dotnet", "POS_VISNAM.dll"]