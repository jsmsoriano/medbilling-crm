-- Temporarily disable the trigger to insert data
DROP TRIGGER IF EXISTS update_claim_ar_fields_trigger ON public.claims;

-- Insert sample claims with manual calculations
INSERT INTO public.claims (
  claim_number, patient_name, client_id, amount, insurance_company, 
  service_date, submission_date, status, notes, days_outstanding, balance_due
)
VALUES 
  ('CLM-TEST-001', 'John Smith', '550e8400-e29b-41d4-a716-446655440001', 1250.00, 'Blue Cross Blue Shield', '2024-12-01', '2024-12-05', 'submitted', 'Annual physical exam', 28, 1250.00),
  ('CLM-TEST-002', 'Sarah Johnson', '550e8400-e29b-41d4-a716-446655440001', 850.00, 'Aetna', '2024-11-28', '2024-11-30', 'submitted', 'Lab work and consultation', 33, 850.00),
  ('CLM-TEST-003', 'Michael Brown', '550e8400-e29b-41d4-a716-446655440002', 2100.00, 'United Healthcare', '2024-11-15', '2024-11-20', 'submitted', 'Emergency visit', 43, 2100.00),
  ('CLM-TEST-004', 'Emily Davis', '550e8400-e29b-41d4-a716-446655440003', 1750.00, 'Cigna', '2024-10-20', '2024-10-25', 'submitted', 'Cardiology consultation', 69, 1750.00),
  ('CLM-TEST-005', 'Robert Wilson', '550e8400-e29b-41d4-a716-446655440002', 900.00, 'Medicare', '2024-10-10', '2024-10-12', 'denied', 'Procedure not covered', 82, 900.00);

-- Add some sample payments to demonstrate the payment posting functionality
INSERT INTO public.payments (claim_id, payment_amount, payment_date, payment_method, reference_number, notes)
SELECT 
  c.id,
  1200.00,
  '2024-12-15',
  'eft',
  'EFT-12345',
  'Partial payment from United Healthcare'
FROM public.claims c 
WHERE c.claim_number = 'CLM-TEST-003'
LIMIT 1;

-- Update the claim status to partially_paid
UPDATE public.claims 
SET status = 'partially_paid', balance_due = 900.00 
WHERE claim_number = 'CLM-TEST-003';

-- Add full payment example
INSERT INTO public.payments (claim_id, payment_amount, payment_date, payment_method, reference_number, notes)
SELECT 
  c.id,
  1750.00,
  '2024-11-15',
  'check',
  'CHK-67890',
  'Full payment from Cigna'
FROM public.claims c 
WHERE c.claim_number = 'CLM-TEST-004'
LIMIT 1;

-- Update the claim status to paid
UPDATE public.claims 
SET status = 'paid', balance_due = 0.00 
WHERE claim_number = 'CLM-TEST-004';