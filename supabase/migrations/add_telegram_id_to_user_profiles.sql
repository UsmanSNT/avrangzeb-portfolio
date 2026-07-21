-- Add telegram_id column to user_profiles table, used to link a Telegram
-- Login Widget account to a Supabase auth user for "Sign in with Telegram".
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE;

-- Add comment
COMMENT ON COLUMN user_profiles.telegram_id IS 'Telegram user id, set when the account was linked via the Telegram Login Widget';
