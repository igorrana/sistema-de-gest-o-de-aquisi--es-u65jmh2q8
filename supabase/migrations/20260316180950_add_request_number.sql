-- Ensures the request_number column exists for custom IDs if the database has this table
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'purchase_requests') THEN
        ALTER TABLE public.purchase_requests ADD COLUMN IF NOT EXISTS request_number TEXT;
    END IF;
END $$;
