# POS_VISNAM

Full-stack POS application gồm:

- **Backend**: ASP.NET Core **.NET 8** (REST API + SignalR)
- **Frontend**: nằm tại `FE/pos_visnam` (React/JS)

---

## 1) Yêu cầu môi trường

### Chạy local (không Docker)
- **.NET SDK 8**: https://dotnet.microsoft.com/download/dotnet/8.0
- **Node.js** (khuyến nghị 18+ hoặc 20+): https://nodejs.org/

### Chạy bằng Docker (full stack)
- Docker Desktop / Docker Engine

---

## 2) Chạy Backend (local)

Backend nằm trong thư mục: `BE/POS_VISNAM`

### 2.1 Restore & run

```bash
cd BE/POS_VISNAM
dotnet restore
dotnet run --project POS_VISNAM/POS_VISNAM.csproj
```

### 2.2 Swagger / API
Khi chạy ở môi trường Development, backend bật Swagger.

- Swagger: `https://localhost:<port>/swagger` hoặc `http://localhost:<port>/swagger`
- SignalR Hub: `/orderHub`

> Ghi chú CORS: backend đang allow origin `http://localhost:3000` và `http://localhost:5173`.

---

## 3) Chạy Frontend (local)

Frontend nằm trong: `FE/pos_visnam`

```bash
cd FE/pos_visnam
npm install
npm run dev
```

Hoặc nếu project dùng CRA thay vì Vite:

```bash
npm start
```

> Nếu FE gọi API backend, hãy cấu hình base URL ở trong file apiService.js và signalRService.js trỏ tới backend local (ví dụ `http://localhost:<backend-port>`).

---

## 4) Chạy full stack bằng Docker (1 Dockerfile)

Mục tiêu: Build frontend -> copy static files vào backend -> backend serve FE.

### 4.1 Build image

Tại root repo:

```bash
docker build -t pos_visnam:latest .
```

### 4.2 Run container

```bash
docker run --rm -p 8080:8080 pos_visnam:latest
```

- Truy cập app: http://localhost:8080
- Nếu Swagger bật trong môi trường container (tùy ASPNETCORE_ENVIRONMENT): http://localhost:8080/swagger

> Mặc định Dockerfile bên dưới chạy Kestrel HTTP port `8080`.
> Bạn có thể đổi port mapping theo nhu cầu.

---

## 5) Cấu trúc thư mục (tóm tắt)

- `BE/POS_VISNAM/` (solution)
- `FE/pos_visnam/` (frontend app)

---

## 6) Troubleshooting

### FE build lỗi
- Đảm bảo Node version phù hợp.
- Xóa cache và cài lại:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### BE không chạy được
- Kiểm tra đang dùng đúng .NET SDK 8:
  ```bash
  dotnet --version
  ```
