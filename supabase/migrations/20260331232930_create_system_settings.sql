CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT,
  trade_name TEXT,
  cnpj TEXT,
  state_registration TEXT,
  municipal_registration TEXT,
  address TEXT,
  holding_company TEXT,
  logo_url TEXT,
  theme_color TEXT DEFAULT '226 71% 40%',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for authenticated users on system_settings" ON public.system_settings;
CREATE POLICY "Allow all for authenticated users on system_settings" ON public.system_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed defaults
INSERT INTO public.system_settings (id, company_name, theme_color)
VALUES ('00000000-0000-0000-0000-000000000000'::uuid, 'Sistema de Gestão de Aquisições', '226 71% 40%')
ON CONFLICT (id) DO NOTHING;
