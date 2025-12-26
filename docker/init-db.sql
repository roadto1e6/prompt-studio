-- Initialize database extensions and settings

-- Enable UUID extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for fuzzy text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Set timezone
SET timezone = 'UTC';

-- Grant privileges (for production security)
-- REVOKE ALL ON SCHEMA public FROM PUBLIC;
-- GRANT ALL ON SCHEMA public TO postgres;

-- Create indexes for better performance (Prisma will create the basic ones)
-- Additional indexes can be added here after initial migration

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'Database initialized successfully at %', NOW();
END $$;
