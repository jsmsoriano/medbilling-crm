-- Insert sample claims with unique numbers
INSERT INTO public.claims (
  claim_number, patient_name, client_id, amount, insurance_company, 
  service_date, submission_date, status, notes
)
VALUES 
  ('CLM-TEST-001', 'John Smith', '550e8400-e29b-41d4-a716-446655440001', 1250.00, 'Blue Cross Blue Shield', '2024-12-01', '2024-12-05', 'submitted', 'Annual physical exam'),
  ('CLM-TEST-002', 'Sarah Johnson', '550e8400-e29b-41d4-a716-446655440001', 850.00, 'Aetna', '2024-11-28', '2024-11-30', 'submitted', 'Lab work and consultation'),
  ('CLM-TEST-003', 'Michael Brown', '550e8400-e29b-41d4-a716-446655440002', 2100.00, 'United Healthcare', '2024-11-15', '2024-11-20', 'submitted', 'Emergency visit'),
  ('CLM-TEST-004', 'Emily Davis', '550e8400-e29b-41d4-a716-446655440003', 1750.00, 'Cigna', '2024-10-20', '2024-10-25', 'submitted', 'Cardiology consultation'),
  ('CLM-TEST-005', 'Robert Wilson', '550e8400-e29b-41d4-a716-446655440002', 900.00, 'Medicare', '2024-10-10', '2024-10-12', 'denied', 'Procedure not covered');