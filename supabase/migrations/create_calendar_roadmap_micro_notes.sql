-- Create calendar events table
CREATE TABLE IF NOT EXISTS portfolio_calendar_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME,
  title TEXT NOT NULL,
  description TEXT DEFAULT ''::text,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  type TEXT DEFAULT 'task', -- task | lab | review | study
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_portfolio_calendar_events_user_id ON portfolio_calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_calendar_events_date ON portfolio_calendar_events(date);

-- Create roadmap milestones table
CREATE TABLE IF NOT EXISTS portfolio_roadmap_milestones (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stage INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'routing',
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  linked_note_ids BIGINT[] DEFAULT ARRAY[]::BIGINT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_portfolio_roadmap_milestones_user_id ON portfolio_roadmap_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_roadmap_milestones_stage ON portfolio_roadmap_milestones(stage);

-- Create micro notes table
CREATE TABLE IF NOT EXISTS portfolio_micro_notes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT NOW()::date NOT NULL,
  content TEXT NOT NULL,
  is_command BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_portfolio_micro_notes_user_id ON portfolio_micro_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_micro_notes_date ON portfolio_micro_notes(date DESC);

-- Enable RLS for the new tables
ALTER TABLE portfolio_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_micro_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe to re-run)
DROP POLICY IF EXISTS "Public can read calendar events" ON portfolio_calendar_events;
DROP POLICY IF EXISTS "Users can insert calendar events" ON portfolio_calendar_events;
DROP POLICY IF EXISTS "Users can manage their calendar events" ON portfolio_calendar_events;

DROP POLICY IF EXISTS "Public can read roadmap milestones" ON portfolio_roadmap_milestones;
DROP POLICY IF EXISTS "Users can insert roadmap milestones" ON portfolio_roadmap_milestones;
DROP POLICY IF EXISTS "Users can manage their roadmap milestones" ON portfolio_roadmap_milestones;

DROP POLICY IF EXISTS "Public can read micro notes" ON portfolio_micro_notes;
DROP POLICY IF EXISTS "Users can insert micro notes" ON portfolio_micro_notes;
DROP POLICY IF EXISTS "Users can manage micro notes" ON portfolio_micro_notes;

-- Public read policies (adjust if you want private)
CREATE POLICY "Public can read calendar events"
  ON portfolio_calendar_events
  FOR SELECT
  USING (true);

CREATE POLICY "Public can read roadmap milestones"
  ON portfolio_roadmap_milestones
  FOR SELECT
  USING (true);

CREATE POLICY "Public can read micro notes"
  ON portfolio_micro_notes
  FOR SELECT
  USING (true);

-- Authenticated users can insert their own rows
CREATE POLICY "Users can insert calendar events"
  ON portfolio_calendar_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert roadmap milestones"
  ON portfolio_roadmap_milestones
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert micro notes"
  ON portfolio_micro_notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update/delete their own rows, admins can manage all
CREATE POLICY "Users can manage their calendar events"
  ON portfolio_calendar_events
  FOR ALL
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can manage their roadmap milestones"
  ON portfolio_roadmap_milestones
  FOR ALL
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Users can manage their micro notes"
  ON portfolio_micro_notes
  FOR ALL
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Trigger functions to update updated_at
CREATE OR REPLACE FUNCTION update_portfolio_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_portfolio_calendar_events_updated_at ON portfolio_calendar_events;
CREATE TRIGGER update_portfolio_calendar_events_updated_at
  BEFORE UPDATE ON portfolio_calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_timestamps();

DROP TRIGGER IF EXISTS update_portfolio_roadmap_milestones_updated_at ON portfolio_roadmap_milestones;
CREATE TRIGGER update_portfolio_roadmap_milestones_updated_at
  BEFORE UPDATE ON portfolio_roadmap_milestones
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_timestamps();

DROP TRIGGER IF EXISTS update_portfolio_micro_notes_updated_at ON portfolio_micro_notes;
CREATE TRIGGER update_portfolio_micro_notes_updated_at
  BEFORE UPDATE ON portfolio_micro_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_timestamps();
