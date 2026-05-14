-- user quotas table
CREATE TABLE public.user_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  image_count INTEGER NOT NULL DEFAULT 0,
  document_count INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: Service role can bypass this. Restrict regular users just to view their own.
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users view own quotas" ON public.user_quotas FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Only allow insert/update via service role / backend trigger
