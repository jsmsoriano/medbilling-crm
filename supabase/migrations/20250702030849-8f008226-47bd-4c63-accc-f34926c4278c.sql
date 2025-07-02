-- Add helper functions and test data

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

-- Insert sample test data
INSERT INTO public.month_end_periods (year, month, status) 
VALUES (2025, 1, 'open')
ON CONFLICT (year, month) DO NOTHING;