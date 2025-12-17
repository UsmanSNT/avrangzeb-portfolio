-- Add cv_url column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS cv_url TEXT;

-- Add comment
COMMENT ON COLUMN user_profiles.cv_url IS 'URL to the user CV/resume file stored in Supabase Storage';

