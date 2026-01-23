-- =========================================================
-- DATABASE MIGRATIONS - Member Ranking Management
-- =========================================================
-- File này chứa các sửa đổi cần thiết để hoàn thiện schema
-- Chạy file này sau khi đã tạo schema ban đầu
-- =========================================================

-- =========================================================
-- 1. CRITICAL FIXES - Cần sửa ngay
-- =========================================================

-- Index cho refresh_token (CRITICAL - code query WHERE refresh_token = $1)
CREATE INDEX IF NOT EXISTS idx_users_refresh_token 
  ON public.users(refresh_token) 
  WHERE refresh_token IS NOT NULL;

-- Indexes cho username và email (WARNING - để rõ ràng và tối ưu)
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- =========================================================
-- 2. RECOMMENDED IMPROVEMENTS - Nên thêm
-- =========================================================

-- Index composite cho gem_claims (query theo user_id và status)
CREATE INDEX IF NOT EXISTS idx_gem_claims_user_status 
  ON public.gem_claims(user_id, status);

-- Index cho check_ins status
CREATE INDEX IF NOT EXISTS idx_checkins_status 
  ON public.check_ins(status);

-- =========================================================
-- 3. TRIGGERS - Tự động update updated_at
-- =========================================================

-- Function để tự động update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers cho các bảng có updated_at
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

-- =========================================================
-- HOÀN TẤT
-- =========================================================
-- Sau khi chạy file này, schema sẽ hoàn chỉnh và tối ưu!

