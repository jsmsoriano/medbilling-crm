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

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_month_end_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_month_end_periods_updated_at
BEFORE UPDATE ON public.month_end_periods
FOR EACH ROW
EXECUTE FUNCTION public.update_month_end_updated_at_column();

CREATE TRIGGER update_month_end_checklist_items_updated_at
BEFORE UPDATE ON public.month_end_checklist_items
FOR EACH ROW
EXECUTE FUNCTION public.update_month_end_updated_at_column();

-- Function to check auto-completable items
CREATE OR REPLACE FUNCTION public.check_month_end_auto_items(period_year INTEGER, period_month INTEGER)
RETURNS VOID AS $$
DECLARE
    period_id UUID;
    month_start DATE;
    month_end DATE;
    open_claims_count INTEGER;
    unresolved_denials_count INTEGER;
    pending_payments_count INTEGER;
BEGIN
    -- Get period ID
    SELECT id INTO period_id 
    FROM public.month_end_periods 
    WHERE year = period_year AND month = period_month;
    
    IF period_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Calculate month boundaries
    month_start := DATE(period_year || '-' || LPAD(period_month::TEXT, 2, '0') || '-01');
    month_end := (month_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
    -- Check open claims
    SELECT COUNT(*) INTO open_claims_count
    FROM public.claims
    WHERE status != 'submitted' 
    AND service_date <= month_end;
    
    IF open_claims_count = 0 THEN
        UPDATE public.month_end_checklist_items
        SET is_completed = true, completed_at = now(), completed_by = 'system'
        WHERE period_id = period_id 
        AND item_name = 'Submit all open claims'
        AND NOT is_completed;
    END IF;
    
    -- Check unresolved denials
    SELECT COUNT(*) INTO unresolved_denials_count
    FROM public.claims
    WHERE status = 'denied' 
    AND (denial_reason IS NOT NULL AND denial_reason != '');
    
    IF unresolved_denials_count = 0 THEN
        UPDATE public.month_end_checklist_items
        SET is_completed = true, completed_at = now(), completed_by = 'system'
        WHERE period_id = period_id 
        AND item_name = 'Resolve denials'
        AND NOT is_completed;
    END IF;
    
    -- Check pending payments reconciliation
    SELECT COUNT(*) INTO pending_payments_count
    FROM public.payments p
    JOIN public.claims c ON p.claim_id = c.id
    WHERE c.service_date <= month_end 
    AND c.payment_amount IS NULL;
    
    IF pending_payments_count = 0 THEN
        UPDATE public.month_end_checklist_items
        SET is_completed = true, completed_at = now(), completed_by = 'system'
        WHERE period_id = period_id 
        AND item_name = 'Reconcile payments'
        AND NOT is_completed;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create standard checklist for a period
CREATE OR REPLACE FUNCTION public.create_standard_checklist(period_id UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.month_end_checklist_items (period_id, item_name, description, is_auto_checkable, sort_order)
    VALUES
        (period_id, 'Submit all open claims', 'Ensure all claims for the month have been submitted', true, 1),
        (period_id, 'Resolve denials', 'Address all denied claims and resubmit or appeal', true, 2),
        (period_id, 'Reconcile payments', 'Match all payments with corresponding claims', true, 3),
        (period_id, 'Download reports', 'Generate and download AR, Claims, Denials, Payments, and Productivity reports', false, 4),
        (period_id, 'Manager sign-off', 'Final approval from AR Manager or Admin', false, 5);
END;
$$ LANGUAGE plpgsql;

-- Insert sample test data
INSERT INTO public.month_end_periods (year, month, status) 
VALUES (2025, 1, 'open');

-- Get the period ID for test data
DO $$
DECLARE
    test_period_id UUID;
BEGIN
    SELECT id INTO test_period_id FROM public.month_end_periods WHERE year = 2025 AND month = 1;
    
    -- Create standard checklist for test period
    PERFORM public.create_standard_checklist(test_period_id);
END $$;

-- Insert sample claims test data
INSERT INTO public.claims (client_id, claim_number, patient_name, insurance_company, amount, service_date, submission_date, status, denial_reason) 
SELECT 
    (SELECT id FROM public.clients LIMIT 1),
    'SAMPLE-' || generate_series,
    'Sample Patient ' || generate_series,
    CASE (generate_series % 3)
        WHEN 0 THEN 'Aetna'
        WHEN 1 THEN 'BCBS'
        ELSE 'Medicare'
    END,
    (1000 + (generate_series * 50))::NUMERIC,
    DATE '2025-01-15' + (generate_series || ' days')::INTERVAL,
    DATE '2025-01-20' + (generate_series || ' days')::INTERVAL,
    CASE (generate_series % 4)
        WHEN 0 THEN 'submitted'
        WHEN 1 THEN 'denied'
        WHEN 2 THEN 'pending'
        ELSE 'submitted'
    END,
    CASE 
        WHEN (generate_series % 4) = 1 THEN 'Missing documentation'
        ELSE NULL
    END
FROM generate_series(1, 10);

-- Insert sample payments test data for some claims
INSERT INTO public.payments (claim_id, payment_amount, payment_date, payment_method, reference_number)
SELECT 
    c.id,
    (c.amount * 0.8)::NUMERIC,
    c.service_date + INTERVAL '30 days',
    'check',
    'REF-' || EXTRACT(epoch FROM now())::INTEGER + generate_series
FROM (
    SELECT id, amount, service_date, ROW_NUMBER() OVER () as rn
    FROM public.claims 
    WHERE claim_number LIKE 'SAMPLE-%'
    LIMIT 5
) c;

-- Add team members for testing if they don't exist
INSERT INTO public.team_members (name, email, role, is_active)
VALUES 
    ('Maria Lopez', 'maria.lopez@sample.com', 'AR Manager', true),
    ('John Smith', 'john.smith@sample.com', 'Biller', true)
ON CONFLICT (email) DO NOTHING;