-- ============================================
-- NOTES TABLE MIGRATION
-- Barcha migration'larni bitta faylda birlashtirildi
-- ============================================

-- 1. Jadval yaratish
CREATE TABLE IF NOT EXISTS portfolio_notes_rows (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  important BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- 2. Indexes yaratish
CREATE INDEX IF NOT EXISTS idx_portfolio_notes_rows_user_id ON portfolio_notes_rows(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_notes_rows_created_at ON portfolio_notes_rows(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_notes_rows_category ON portfolio_notes_rows(category);

-- 3. RLS yoqish
ALTER TABLE portfolio_notes_rows ENABLE ROW LEVEL SECURITY;

-- 4. Eski policy'larni o'chirish
DROP POLICY IF EXISTS "Public can read all notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Users can read their own notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Authenticated users can insert their own notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Users can update their own notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Users can delete their own notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Users can update their own notes, admins can update all" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Users can delete their own notes, admins can delete all" ON portfolio_notes_rows;

-- 5. Yangi RLS Policy'lar yaratish

-- Public can read all notes (hamma ko'ra oladi)
CREATE POLICY "Public can read all notes"
  ON portfolio_notes_rows
  FOR SELECT
  USING (true);

-- Authenticated users can insert their own notes
CREATE POLICY "Authenticated users can insert their own notes"
  ON portfolio_notes_rows
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own notes, admins can update all
CREATE POLICY "Users can update their own notes, admins can update all"
  ON portfolio_notes_rows
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Users can delete their own notes, admins can delete all
CREATE POLICY "Users can delete their own notes, admins can delete all"
  ON portfolio_notes_rows
  FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- 6. Trigger function yaratish
CREATE OR REPLACE FUNCTION update_portfolio_notes_rows_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 7. Trigger yaratish
DROP TRIGGER IF EXISTS update_portfolio_notes_rows_updated_at ON portfolio_notes_rows;

CREATE TRIGGER update_portfolio_notes_rows_updated_at
  BEFORE UPDATE ON portfolio_notes_rows
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_notes_rows_updated_at();

-- ============================================
-- Migration muvaffaqiyatli yakunlandi!
-- ============================================

