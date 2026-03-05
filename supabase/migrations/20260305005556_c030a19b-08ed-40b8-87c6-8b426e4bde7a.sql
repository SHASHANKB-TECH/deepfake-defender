ALTER TABLE public.analyses 
ADD COLUMN IF NOT EXISTS detailed_report jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS scan_mode text DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS suspected_method text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS anomalies jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS confidence_reasons jsonb DEFAULT '[]'::jsonb;