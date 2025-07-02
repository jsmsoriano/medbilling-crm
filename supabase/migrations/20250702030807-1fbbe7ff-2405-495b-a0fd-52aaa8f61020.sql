-- Create Month-End Close Module Tables

-- Month-end periods table
CREATE TABLE public.month_end_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  close_date DATE,
  closed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(year, month)
);

-- Month-end checklist items table
CREATE TABLE public.month_end_checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_id UUID NOT NULL REFERENCES public.month_end_periods(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by TEXT,
  is_auto_checkable BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Month-end sign-offs table
CREATE TABLE public.month_end_sign_offs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_id UUID NOT NULL REFERENCES public.month_end_periods(id) ON DELETE CASCADE,
  signed_by TEXT NOT NULL,
  signature_type TEXT NOT NULL DEFAULT 'digital' CHECK (signature_type IN ('digital', 'electronic')),
  signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  notes TEXT
);

-- Month-end audit log table
CREATE TABLE public.month_end_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_id UUID NOT NULL REFERENCES public.month_end_periods(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('insert', 'update', 'delete')),
  old_values JSONB,
  new_values JSONB,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.month_end_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.month_end_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.month_end_sign_offs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.month_end_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can manage month-end periods" 
ON public.month_end_periods FOR ALL 
USING (true);

CREATE POLICY "Authenticated users can manage checklist items" 
ON public.month_end_checklist_items FOR ALL 
USING (true);

CREATE POLICY "Authenticated users can manage sign-offs" 
ON public.month_end_sign_offs FOR ALL 
USING (true);

CREATE POLICY "Authenticated users can view audit log" 
ON public.month_end_audit_log FOR SELECT 
USING (true);

CREATE POLICY "System can insert audit log" 
ON public.month_end_audit_log FOR INSERT 
WITH CHECK (true);