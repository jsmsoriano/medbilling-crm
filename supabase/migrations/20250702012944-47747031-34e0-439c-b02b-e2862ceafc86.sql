-- Fix the function to properly handle date calculations
CREATE OR REPLACE FUNCTION public.update_claim_ar_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate days outstanding from submission date
  NEW.days_outstanding = COALESCE(
    EXTRACT('day' FROM CURRENT_DATE - NEW.submission_date)::INTEGER, 
    0
  );
  
  -- Calculate balance due (claim amount - total payments)
  NEW.balance_due = NEW.amount - COALESCE(
    (SELECT SUM(payment_amount) 
     FROM public.payments 
     WHERE claim_id = NEW.id), 
    0
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Now insert sample data
-- Insert sample clients if they don't exist
INSERT INTO public.clients (id, name, email, status, practice_type, phone, city, state)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Metro Medical Center', 'admin@metromedical.com', 'active', 'Primary Care', '555-0001', 'New York', 'NY'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Sunrise Family Practice', 'contact@sunrisefamily.com', 'active', 'Family Medicine', '555-0002', 'Los Angeles', 'CA'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Downtown Cardiology', 'info@downtowncardio.com', 'active', 'Cardiology', '555-0003', 'Chicago', 'IL')
ON CONFLICT (id) DO NOTHING;

-- Insert sample claims for testing
INSERT INTO public.claims (
  id, claim_number, patient_name, client_id, amount, insurance_company, 
  service_date, submission_date, status, notes
)
VALUES 
  ('660e8400-e29b-41d4-a716-446655440001', 'CLM-2024-001', 'John Smith', '550e8400-e29b-41d4-a716-446655440001', 1250.00, 'Blue Cross Blue Shield', '2024-12-01', '2024-12-05', 'submitted', 'Annual physical exam'),
  ('660e8400-e29b-41d4-a716-446655440002', 'CLM-2024-002', 'Sarah Johnson', '550e8400-e29b-41d4-a716-446655440001', 850.00, 'Aetna', '2024-11-28', '2024-11-30', 'submitted', 'Lab work and consultation'),
  ('660e8400-e29b-41d4-a716-446655440003', 'CLM-2024-003', 'Michael Brown', '550e8400-e29b-41d4-a716-446655440002', 2100.00, 'United Healthcare', '2024-11-15', '2024-11-20', 'partially_paid', 'Emergency visit'),
  ('660e8400-e29b-41d4-a716-446655440004', 'CLM-2024-004', 'Emily Davis', '550e8400-e29b-41d4-a716-446655440003', 1750.00, 'Cigna', '2024-10-20', '2024-10-25', 'paid', 'Cardiology consultation'),
  ('660e8400-e29b-41d4-a716-446655440005', 'CLM-2024-005', 'Robert Wilson', '550e8400-e29b-41d4-a716-446655440002', 900.00, 'Medicare', '2024-12-10', '2024-12-12', 'denied', 'Procedure not covered')
ON CONFLICT (id) DO NOTHING;

-- Insert sample payments for testing
INSERT INTO public.payments (
  id, claim_id, payment_amount, payment_date, payment_method, reference_number, notes
)
VALUES 
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 1200.00, '2024-12-01', 'eft', 'EFT-12345', 'Partial payment from United Healthcare'),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', 1750.00, '2024-11-15', 'check', 'CHK-67890', 'Full payment from Cigna')
ON CONFLICT (id) DO NOTHING;