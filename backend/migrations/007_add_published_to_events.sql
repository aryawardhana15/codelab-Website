-- Add published flag to events
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_events_published ON events(published);
