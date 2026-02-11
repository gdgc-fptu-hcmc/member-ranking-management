# 🧭 Member Ranking Management

Nền tảng quản lý thứ hạng thành viên cho GDG club với điểm (gems), theo dõi tiến độ và hỗ trợ quản trị bằng AI (Gemini).

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Sử dụng](#sử-dụng)
- [Tài khoản demo](#tài-khoản-demo)
- [API Documentation](#api-documentation)
- [Scripts](#scripts)
- [Theo dõi tiến độ](#theo-dõi-tiến-độ)
- [Danh sách tính năng](#danh-sách-tính-năng)
- [Phát triển](#phát-triển)
- [Build và Deploy](#build-và-deploy)
- [Đóng góp](#đóng-góp)
- [License](#license)
- [Authors](#authors)

## Giới thiệu

Member Ranking Management là ứng dụng web quản lý thứ hạng thành viên, điểm thưởng (gems) và thống kê hoạt động. Nền tảng giúp Admin theo dõi tiến độ, xếp hạng, và hỗ trợ tương tác giữa các thành viên GDG club.

Nền tảng cung cấp:

- **Theo dõi tiến độ**: Lịch sử check-in, điểm số, và cấp bậc
- **Xếp hạng minh bạch**: Quy tắc tính điểm rõ ràng, có log thay đổi
- **Hỗ trợ quản trị**: Công cụ AI (Gemini) để tóm tắt và gợi ý
- **Tương tác thành viên**: Kênh kết nối cho GDG club

## Tính năng

### 🔐 Xác thực (Authentication)

- ✅ Đăng ký/đăng nhập (API + UI)
- ✅ Refresh token (API + AuthBootstrap)
- ✅ Đăng xuất (API + UI)
- ✅ Bảo vệ route theo vai trò (RequireAuth/RequireRole)

### 👤 Hồ sơ thành viên (Profile)

- ✅ API lấy/cập nhật hồ sơ cá nhân (GET/POST /v1/users/me)
- ⏳ UI hồ sơ thành viên

### 🧩 Gems & Logs

- ✅ API điều chỉnh gems thủ công (POST /v1/gem-logs/users/:id/adjust-gem)
- ✅ UI điều chỉnh gems (Manual Gems Modal)
- ✅ API lịch sử gems (GET /v1/gem-logs/users/:id)
- ⏳ UI lịch sử gems

### 🏆 Xếp hạng (Ranking)

- ✅ API bảng xếp hạng (GET /v1/users/ranking)
- ⏳ UI bảng xếp hạng

### 📅 Hoạt động & Check-in

- ✅ API hoạt động (GET/POST/PUT/DELETE /v1/activities)
- ✅ API join & check-in (POST /v1/activities/:id/join, POST /v1/activities/:activityId/checkins)
- ✅ API lịch sử check-in cá nhân (GET /v1/activities/checkins/me)
- ⏳ UI hoạt động & check-in

### 👨‍💼 Quản trị (Admin)

- ✅ UI danh sách thành viên (trang Member Management)
- ✅ API quản lý thành viên (GET/POST/DELETE /v1/users)
- ⏳ UI quản lý hoạt động & báo cáo

### 🤖 Trợ lý AI (Gemini)

- ✅ API chat AI (/api/assistant/send, /api/assistant/history)
- ✅ UI chatbox (AssistantChatbox)

### 🌐 Landing page

- ✅ Giao diện landing và các section giới thiệu

## Công nghệ sử dụng

### Frontend Framework

- **Vite** - Build tool và dev server nhanh
- **React** - UI library

### UI & Styling

- **CSS** - Styling

### Routing & State Management

- **React Router** - Client-side routing

### HTTP Client

- **Axios** - HTTP client với interceptors

### Utilities

- **dayjs** - Date manipulation
- **Gemini** - AI assistant cho admin

## Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0 hoặc **yarn**: >= 1.22.0
- **Git**: >= 2.0.0

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd member-ranking-management
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

## Cấu trúc dự án

```
backend/
├── src/
│   ├── config/         # DB config
│   ├── controllers/    # API controllers
│   ├── models/         # Data models
│   └── routers/        # Route definitions
│
frontend/
├── src/
│   ├── api/            # Axios instance
│   ├── auth/           # Auth context/guards
│   ├── components/     # Shared UI
│   ├── pages/          # App pages
│   ├── routes/         # Route config
│   ├── App.jsx
│   └── main.jsx
```

## Sử dụng

### Đăng nhập

1. Truy cập `/login`
2. Nhập email và mật khẩu
3. Chọn vai trò (Member/Admin)

### Theo dõi tiến độ

1. Vào **Dashboard**
2. Xem **Progress** và **Ranking**
3. Kiểm tra lịch sử gems và cấp bậc

### Quản trị (Admin)

1. Đăng nhập với tài khoản Admin
2. Truy cập **Admin Panel**
3. Quản lý thành viên, quy tắc điểm và logs

## Tài khoản demo

### Admin

```
Email: admin@example.com
Password: admin123
```

### Member

```
Email: member@example.com (hoặc bất kỳ email nào)
Password: bất kỳ mật khẩu nào
```

## API Documentation

### Auth API

```typescript
POST /v1/auth/register
POST /v1/auth/login
POST /v1/auth/refresh
POST /v1/auth/logout
```

### Users API

```typescript
GET /v1/users               // admin
POST /v1/users              // admin
DELETE /v1/users/:id        // admin

GET /v1/users/me            // self
POST /v1/users/me           // self

GET /v1/users/:id           // public
GET /v1/users/ranking       // public
```

### Gems & Logs API

```typescript
GET /v1/gem-logs/users/:id
POST /v1/gem-logs/users/:id/adjust-gem
```

### Activities API

```typescript
GET /v1/activities
GET /v1/activities/:id
POST /v1/activities                 // admin
PUT /v1/activities/:id              // admin
DELETE /v1/activities/:id           // admin
GET /v1/activities/:id/participants // admin

POST /v1/activities/:id/join
POST /v1/activities/:activityId/checkins
GET /v1/activities/checkins/me
```

### Assistant API

```typescript
GET /api/assistant/history
POST /api/assistant/send
```

### Legacy/Test API

```typescript
GET /api/test
GET /api/members
```

**Lưu ý**: Danh sách trên được lấy từ routes hiện có trong backend.

## Scripts

### Development

```bash
npm run dev          # Chạy dev server
```

### Build

```bash
npm run build        # Build production
npm run preview      # Preview production build
```

### Linting

```bash
npm run lint         # Chạy ESLint
```

## Theo dõi tiến độ

### Tổng quan

- **Mốc hiện tại**: M03 - Quản trị thành viên & gems
- **Tốc độ**: 40% (ước lượng theo API + UI hiện có)
- **Ngày cập nhật**: 2026-02-11

### Checklist Sprint hiện tại

- [x] Auth API (register/login/refresh/logout)
- [x] Auth UI (login/register/logout)
- [x] Route guard theo vai trò
- [x] Trang quản trị thành viên (list users)
- [x] Điều chỉnh gems thủ công (UI + API)
- [x] Chatbox trợ lý AI (UI + API)
- [ ] UI hồ sơ thành viên
- [ ] UI lịch sử gems
- [ ] UI bảng xếp hạng
- [ ] UI hoạt động & check-in

## Danh sách tính năng

### Hoàn thành

- [x] Đăng ký/đăng nhập (UI)
- [x] Refresh token + bảo vệ route
- [x] Đăng xuất
- [x] Landing page
- [x] Danh sách thành viên (UI)
- [x] Điều chỉnh gems thủ công
- [x] Trợ lý AI (landing page's chatbox)

### Đang thực hiện

- [ ] UI hồ sơ thành viên
- [ ] UI lịch sử gems
- [ ] UI bảng xếp hạng
- [ ] UI hoạt động & check-in

### Sắp tới

- [ ] Dashboard báo cáo tổng quan
- [ ] Quản lý hoạt động (admin UI)
- [ ] Thông báo/nhắc lịch hoạt động
- [ ] Tương tác thành viên nâng cao

## Phát triển

### Thêm feature mới

1. Tạo folder trong `frontend/src/components/` hoặc `frontend/src/pages/`
2. Thêm API trong `backend/src/controllers/`
3. Thêm route trong `frontend/src/routes/`

### Thêm component mới

- **UI Component**: Thêm vào `frontend/src/components/`
- **Page**: Thêm vào `frontend/src/pages/`

### State Management

- **Global State**: Auth context và local state

### Styling

- Sử dụng CSS trong `frontend/src/App.css` và `frontend/src/index.css`

## Build và Deploy

### Build production

```bash
npm run build
```

Output sẽ được tạo trong folder `dist/`

### Deploy

#### Vercel

```bash
npm install -g vercel
vercel
```

## Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Code Style

- Sử dụng ESLint và Prettier
- Tuân thủ TypeScript best practices
- Viết comments cho code phức tạp

## License

This project is licensed under the MIT License.

## Authors

- **Development Team** - GDG Club

---

**Made with ❤️ by GDG Club**
