-- Create portfolio_it_news table
CREATE TABLE IF NOT EXISTS portfolio_it_news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_portfolio_it_news_user_id ON portfolio_it_news(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_it_news_created_at ON portfolio_it_news(created_at DESC);

-- Enable RLS
ALTER TABLE portfolio_it_news ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can read all news
CREATE POLICY "Public can read all news"
  ON portfolio_it_news
  FOR SELECT
  USING (true);

-- Authenticated users can insert their own news
CREATE POLICY "Users can insert their own news"
  ON portfolio_it_news
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own news, admins can update all
CREATE POLICY "Users can update their own news, admins can update all"
  ON portfolio_it_news
  FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Users can delete their own news, admins can delete all
CREATE POLICY "Users can delete their own news, admins can delete all"
  ON portfolio_it_news
  FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Function to update updated_at timestamp
-- SECURITY: Set search_path to prevent search path manipulation attacks
CREATE OR REPLACE FUNCTION update_portfolio_it_news_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_portfolio_it_news_updated_at
  BEFORE UPDATE ON portfolio_it_news
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_it_news_updated_at();

