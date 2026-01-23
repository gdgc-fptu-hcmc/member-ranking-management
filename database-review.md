# Database Schema Review - Member Ranking Management

## 📊 Tổng quan Schema

Schema của bạn rất **tốt và chuyên nghiệp** với:
- ✅ Sử dụng UUID cho tất cả primary keys (bảo mật tốt hơn)
- ✅ Có đầy đủ indexes phù hợp
- ✅ Foreign keys với cascade rules hợp lý
- ✅ Timestamps và constraints đầy đủ
- ✅ Hỗ trợ tính năng ranking với gems system

---

## ✅ ĐIỂM MẠNH

### 1. **Bảng `users` - Hoàn toàn tương thích với code hiện tại**
- ✅ Có đầy đủ các trường bắt buộc: `username`, `email`, `password`, `refresh_token`, `roles`
- ✅ `roles` là `TEXT[]` - đúng với cách code sử dụng `user.roles.includes('admin')`
- ✅ `username` và `email` có UNIQUE constraint - đúng với error handling code (23505)
- ✅ Có các trường mở rộng: `avatar`, `is_male`, `address`, `club_role`
- ✅ Thêm tính năng gems: `total_gems`, `regular_session_count`

### 2. **Cấu trúc Database rất tốt**
- ✅ Normalized design (tách riêng activities, check_ins, gem_claims, gem_logs)
- ✅ Foreign keys với cascade rules hợp lý
- ✅ Indexes được tối ưu cho các query thường dùng

### 3. **Tính năng mở rộng**
- ✅ Hệ thống gems/points để ranking members
- ✅ Check-in system cho activities
- ✅ Evidence tracking với arrays
- ✅ Idempotency keys để tránh duplicate transactions

---

## ⚠️ CÁC VẤN ĐỀ CẦN SỬA

### 🔴 **CRITICAL - Thiếu Index trên `refresh_token`**

**Vấn đề:** Code sử dụng query `SELECT * FROM users WHERE refresh_token = $1` nhưng không có index.

**Tác động:** Query sẽ chậm khi có nhiều users.

**Sửa:**
```sql
CREATE INDEX IF NOT EXISTS idx_users_refresh_token 
  ON public.users(refresh_token) 
  WHERE refresh_token IS NOT NULL;
```

---

### 🟡 **WARNING - Thiếu Index trên `users.email`**

**Vấn đề:** Code có thể query theo email trong tương lai, nên cần index.

**Sửa:**
```sql
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
```

**Lưu ý:** Index này có thể không cần thiết ngay vì đã có UNIQUE constraint (PostgreSQL tự tạo index), nhưng nên thêm để rõ ràng.

---

### 🟡 **WARNING - Thiếu Index trên `users.username`**

**Vấn đề:** Code query `SELECT * FROM users WHERE username = $1` nhưng không có index rõ ràng.

**Sửa:**
```sql
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
```

**Lưu ý:** Tương tự như email, UNIQUE constraint đã tạo index, nhưng nên thêm để rõ ràng.

---

### 🟡 **SUGGESTION - Thiếu Trigger tự động update `updated_at`**

**Vấn đề:** Các bảng có `updated_at` nhưng không có trigger tự động cập nhật.

**Sửa:**
```sql
-- Function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply cho tất cả các bảng có updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at 
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gem_claims_updated_at 
  BEFORE UPDATE ON public.gem_claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gem_logs_updated_at 
  BEFORE UPDATE ON public.gem_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 🟡 **SUGGESTION - Thiếu Index composite cho query phổ biến**

**Vấn đề:** Có thể cần query theo `user_id` và `status` trong `gem_claims`.

**Sửa:**
```sql
CREATE INDEX IF NOT EXISTS idx_gem_claims_user_status 
  ON public.gem_claims(user_id, status);
```

---

### 🟢 **OPTIONAL - Thêm Index cho `check_ins` theo status**

**Vấn đề:** Có thể cần query check-ins theo status.

**Sửa:**
```sql
CREATE INDEX IF NOT EXISTS idx_checkins_status 
  ON public.check_ins(status);
```

---

## 📝 SCHEMA HOÀN CHỈNH (Với các sửa đổi)

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- 1) users
-- =========================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,

  roles TEXT[] NOT NULL DEFAULT '{member}',
  club_role TEXT,

  total_gems INT NOT NULL DEFAULT 0,
  regular_session_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,

  join_club_at TIMESTAMPTZ,
  refresh_token TEXT,

  avatar TEXT,
  is_male BOOLEAN,
  address TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes cho users
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_refresh_token 
  ON public.users(refresh_token) 
  WHERE refresh_token IS NOT NULL;

-- =========================================================
-- 2) activities
-- =========================================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  title TEXT NOT NULL,
  type TEXT NOT NULL,

  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,

  location TEXT,
  description TEXT,

  checkin_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  requires_evidence BOOLEAN NOT NULL DEFAULT FALSE,

  status TEXT NOT NULL DEFAULT 'upcoming',
  gem_amount INT NOT NULL DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activities_type ON public.activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_starts_at ON public.activities(starts_at);
CREATE INDEX IF NOT EXISTS idx_activities_status_starts_at
  ON public.activities(status, starts_at);

-- =========================================================
-- 3) gem_claims
-- =========================================================
CREATE TABLE IF NOT EXISTS public.gem_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES public.users(id) ON DELETE CASCADE,

  kind TEXT NOT NULL,
  amount INT NOT NULL,
  reason TEXT NOT NULL,

  activity_id UUID
    REFERENCES public.activities(id) ON DELETE SET NULL,

  evidence_urls TEXT[] NOT NULL DEFAULT '{}'::TEXT[],

  status TEXT NOT NULL DEFAULT 'validating',
  ai JSONB,

  idempotency_key TEXT NOT NULL UNIQUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gem_claims_user_id ON public.gem_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_gem_claims_activity_id ON public.gem_claims(activity_id);
CREATE INDEX IF NOT EXISTS idx_gem_claims_user_status 
  ON public.gem_claims(user_id, status);

-- =========================================================
-- 4) check_ins
-- =========================================================
CREATE TABLE IF NOT EXISTS public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  activity_id UUID NOT NULL
    REFERENCES public.activities(id) ON DELETE CASCADE,

  user_id UUID NOT NULL
    REFERENCES public.users(id) ON DELETE CASCADE,

  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  status TEXT NOT NULL DEFAULT 'pending', -- pending / attended / absent

  evidence TEXT[] NOT NULL DEFAULT '{}'::TEXT[],

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_checkins_activity_user UNIQUE (activity_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_checkins_activity_id ON public.check_ins(activity_id);
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON public.check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_status ON public.check_ins(status);

-- =========================================================
-- 5) gem_logs
-- =========================================================
CREATE TABLE IF NOT EXISTS public.gem_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES public.users(id) ON DELETE CASCADE,

  amount INT NOT NULL,
  reason TEXT NOT NULL,

  source_kind TEXT NOT NULL,

  activity_id UUID
    REFERENCES public.activities(id) ON DELETE SET NULL,

  checkin_id UUID
    REFERENCES public.check_ins(id) ON DELETE SET NULL,

  claim_id UUID
    REFERENCES public.gem_claims(id) ON DELETE SET NULL,

  evidence TEXT[] NOT NULL DEFAULT '{}'::TEXT[],

  idempotency_key TEXT NOT NULL UNIQUE,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gem_logs_user_id ON public.gem_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_gem_logs_activity_id ON public.gem_logs(activity_id);
CREATE INDEX IF NOT EXISTS idx_gem_logs_claim_id ON public.gem_logs(claim_id);
CREATE INDEX IF NOT EXISTS idx_gem_logs_user_created_at
  ON public.gem_logs(user_id, created_at);

-- =========================================================
-- TRIGGERS - Tự động update updated_at
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at 
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gem_claims_updated_at 
  BEFORE UPDATE ON public.gem_claims
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gem_logs_updated_at 
  BEFORE UPDATE ON public.gem_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 🔍 KIỂM TRA TƯƠNG THÍCH VỚI CODE

### ✅ Tất cả queries trong code đều tương thích:

1. **Register User** ✅
   ```sql
   INSERT INTO users (username, email, password) VALUES($1, $2, $3) RETURNING *;
   ```
   - Hoạt động tốt với UUID (id tự động generate)

2. **Login User** ✅
   ```sql
   SELECT * FROM users WHERE username = $1 LIMIT 1;
   ```
   - Cần index trên username (đã thêm ở trên)

3. **Update Refresh Token** ✅
   ```sql
   UPDATE users SET refresh_token = $1 WHERE id = $2;
   ```
   - UUID hoạt động tốt với WHERE id = $2

4. **Refresh Token Verification** ✅
   ```sql
   SELECT * FROM users WHERE refresh_token = $1;
   ```
   - **CẦN INDEX** (đã thêm ở trên)

5. **Logout** ✅
   ```sql
   UPDATE users SET refresh_token = NULL WHERE refresh_token = $1;
   ```
   - Hoạt động tốt

### ✅ JWT Token với UUID

Code sử dụng `user.id` trong JWT:
```javascript
jwt.sign({ id: user.id, roles: user.roles }, ...)
```

**UUID hoạt động tốt** vì:
- JWT có thể lưu UUID dưới dạng string
- PostgreSQL tự động convert UUID sang string khi query
- Không có vấn đề về type mismatch

---

## 📋 CHECKLIST CUỐI CÙNG

### Bảng `users`
- [x] Có trường `id` (UUID) - ✅
- [x] Có trường `username` với UNIQUE và NOT NULL - ✅
- [x] Có trường `email` với UNIQUE và NOT NULL - ✅
- [x] Có trường `password` với NOT NULL - ✅
- [x] Có trường `refresh_token` (NULLABLE) - ✅
- [x] Có trường `roles` (TEXT[]) - ✅
- [ ] **Cần thêm:** Index trên `refresh_token` - ⚠️
- [ ] **Nên thêm:** Index trên `username` và `email` (rõ ràng hơn) - 💡

### Các bảng khác
- [x] Foreign keys đúng - ✅
- [x] Indexes phù hợp - ✅
- [ ] **Nên thêm:** Triggers cho `updated_at` - 💡
- [ ] **Nên thêm:** Index composite cho `gem_claims(user_id, status)` - 💡

---

## 🎯 KẾT LUẬN

### ✅ Schema của bạn RẤT TỐT với:
1. Cấu trúc database chuyên nghiệp
2. Tương thích hoàn toàn với code hiện tại
3. Hỗ trợ tính năng ranking với gems system
4. Design normalized và scalable

### ⚠️ Cần sửa ngay:
1. **Thêm index trên `users.refresh_token`** (CRITICAL)
2. Thêm index trên `users.username` và `users.email` (WARNING)

### 💡 Nên thêm:
1. Triggers tự động update `updated_at`
2. Index composite cho `gem_claims(user_id, status)`
3. Index cho `check_ins.status`

### 🚀 Sau khi sửa:
Schema sẽ **hoàn hảo** và sẵn sàng cho production!

