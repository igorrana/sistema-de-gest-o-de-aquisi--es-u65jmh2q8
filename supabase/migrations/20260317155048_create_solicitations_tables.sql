-- Create purchase_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.purchase_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT,
    description TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Material',
    project_id TEXT,
    request_type_id TEXT,
    priority TEXT NOT NULL DEFAULT 'P2',
    need_date TEXT,
    delivery_date TEXT,
    status_changed_at TIMESTAMPTZ,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    is_delayed BOOLEAN NOT NULL DEFAULT false,
    status_id TEXT,
    requester_id TEXT,
    buyer_id TEXT,
    board TEXT,
    order_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create purchase_request_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.purchase_request_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_request_id UUID REFERENCES public.purchase_requests(id) ON DELETE CASCADE,
    material_id TEXT,
    quantity NUMERIC NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_request_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Allow all for authenticated users on purchase_requests" ON public.purchase_requests;
DROP POLICY IF EXISTS "Allow all for authenticated users on purchase_request_items" ON public.purchase_request_items;

-- Create RLS policies
CREATE POLICY "Allow all for authenticated users on purchase_requests" ON public.purchase_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users on purchase_request_items" ON public.purchase_request_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
