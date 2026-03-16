-- Add max_days to statuses for deadline monitoring
ALTER TABLE IF EXISTS statuses ADD COLUMN IF NOT EXISTS max_days INTEGER NULL;

-- Ensure status_changed_at exists on requests for accurate tracking
ALTER TABLE IF EXISTS requests ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMPTZ DEFAULT NOW();
