-- Fix RLS policies for portfolio_notes_rows table
-- Ensure public can read all notes

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read all notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Users can read their own notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Authenticated users can insert their own notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Users can update their own notes" ON portfolio_notes_rows;
DROP POLICY IF EXISTS "Users can delete their own notes" ON portfolio_notes_rows;

-- Public can read all notes
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

