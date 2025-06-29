
-- First, let's insert the basic clients that exist in the frontend mock data
INSERT INTO public.clients (name, email, phone, address, city, state, zip_code, practice_type, status, contract_start_date, monthly_revenue, notes, office_contact_name, contract_percentage, billing_cycle_start_date) VALUES
('Valley Medical Group', 'contact@valleymedical.com', '(555) 123-4567', '123 Medical Plaza, Suite 200', 'San Francisco', 'CA', '94105', 'Family Practice', 'active', '2023-01-15', 12500, 'Primary family practice with 3 providers', 'Dr. Sarah Williams', 8.0, '2023-01-15'),
('Coastal Orthopedics', 'billing@coastalortho.com', '(555) 987-6543', '456 Ocean Drive', 'Los Angeles', 'CA', '90210', 'Orthopedics', 'active', '2022-08-20', 18750, 'Specializes in sports medicine and joint replacement', 'Dr. Michael Johnson', 7.5, '2022-08-20'),
('Downtown Dental', 'admin@downtowndental.com', '(555) 456-7890', '789 Main Street, Floor 3', 'San Diego', 'CA', '92101', 'Dental', 'inactive', '2023-03-10', 8200, 'General dentistry practice with cosmetic services', 'Dr. Lisa Chen', 9.0, '2023-03-10'),
('Pediatric Care Center', 'info@pediatriccare.com', '(555) 321-0987', '321 Children''s Way', 'Sacramento', 'CA', '95814', 'Pediatrics', 'active', '2023-06-01', 15300, 'Full-service pediatric clinic serving ages 0-18', 'Dr. Robert Davis', 8.5, '2023-06-01');

-- Add additional clients to make the system more realistic
INSERT INTO public.clients (name, email, phone, address, city, state, zip_code, practice_type, status, contract_start_date, monthly_revenue, notes, office_contact_name, contract_percentage, billing_cycle_start_date) VALUES
('Metro Cardiology Associates', 'admin@metrocardio.com', '(555) 111-2222', '789 Heart Lane', 'Los Angeles', 'CA', '90025', 'Cardiology', 'active', '2023-02-01', 22000, 'Specializes in interventional cardiology', 'Dr. Emily Chen', 8.5, '2023-02-01'),
('Westside Dermatology', 'billing@westsidederm.com', '(555) 333-4444', '456 Skin Street', 'San Francisco', 'CA', '94110', 'Dermatology', 'active', '2023-04-15', 16500, 'Cosmetic and medical dermatology', 'Jessica Martinez', 7.8, '2023-04-15'),
('Prime Physical Therapy', 'contact@primept.com', '(555) 555-6666', '321 Recovery Road', 'San Diego', 'CA', '92103', 'Physical Therapy', 'pending', '2024-01-01', 9800, 'Sports rehabilitation specialists', 'Mark Thompson', 9.2, '2024-01-01');

-- Now insert test data for tasks with proper client references
INSERT INTO public.tasks (title, description, client_id, assigned_to, priority, status, due_date, is_recurring, recurrence_pattern) VALUES
('Review Monthly Billing Report', 'Complete review of billing report for Valley Medical Group', (SELECT id FROM public.clients WHERE name = 'Valley Medical Group' LIMIT 1), 'John Smith', 'high', 'open', '2024-12-30', false, null),
('Follow up on Denied Claims', 'Contact insurance company regarding denied claims', (SELECT id FROM public.clients WHERE name = 'Coastal Orthopedics' LIMIT 1), 'Sarah Johnson', 'urgent', 'in_progress', '2024-12-28', false, null),
('Update Patient Demographics', 'Update patient information in system', (SELECT id FROM public.clients WHERE name = 'Downtown Dental' LIMIT 1), 'Mike Wilson', 'medium', 'open', '2025-01-05', false, null),
('Quarterly Compliance Audit', 'Perform quarterly compliance review', (SELECT id FROM public.clients WHERE name = 'Pediatric Care Center' LIMIT 1), 'John Smith', 'high', 'open', '2024-12-25', false, null),
('Insurance Verification', 'Verify insurance coverage for new patients', (SELECT id FROM public.clients WHERE name = 'Valley Medical Group' LIMIT 1), 'Sarah Johnson', 'medium', 'completed', '2024-12-20', false, null),
('Claims Submission Review', 'Review and submit pending claims', null, 'Mike Wilson', 'urgent', 'open', '2024-12-29', false, null),
('Monthly Team Meeting Prep', 'Prepare materials for monthly team meeting', null, 'John Smith', 'low', 'open', '2025-01-10', true, 'monthly'),
('Patient Payment Follow-up', 'Contact patients with outstanding balances', (SELECT id FROM public.clients WHERE name = 'Coastal Orthopedics' LIMIT 1), 'Sarah Johnson', 'medium', 'in_progress', '2025-01-02', false, null);

-- Add some credentialing test data with unique NPI numbers
INSERT INTO public.credentialing_doctors (first_name, last_name, specialty, license_number, license_state, license_expiry, npi_number, email, phone, address, city, state, zip_code, dea_number, dea_expiry, board_certification, board_expiry) VALUES
('Michael', 'Rodriguez', 'Internal Medicine', 'MD12345', 'CA', '2025-06-30', '1234567891', 'mrodriguez@email.com', '(555) 111-1111', '123 Doctor St', 'Los Angeles', 'CA', '90210', 'DR1234567', '2025-12-31', 'American Board of Internal Medicine', '2026-01-01'),
('Jennifer', 'Lee', 'Pediatrics', 'MD67890', 'CA', '2025-08-15', '0987654322', 'jlee@email.com', '(555) 222-2222', '456 Pediatric Ave', 'San Francisco', 'CA', '94105', 'DR7654321', '2025-11-30', 'American Board of Pediatrics', '2025-12-15'),
('Robert', 'Kim', 'Orthopedic Surgery', 'MD11111', 'CA', '2025-05-20', '1111111112', 'rkim@email.com', '(555) 333-3333', '789 Bone Blvd', 'San Diego', 'CA', '92101', 'DR1111111', '2025-10-31', 'American Board of Orthopedic Surgery', '2025-11-01');

-- Insert credentialing applications
INSERT INTO public.credentialing_applications (doctor_id, status, application_type, insurance_company, priority, application_date, submission_date, approval_date, notes, estimated_completion_days, expiry_date) VALUES
((SELECT id FROM public.credentialing_doctors WHERE last_name = 'Rodriguez' LIMIT 1), 'pending_documents', 'initial', 'Blue Cross Blue Shield', 'urgent', '2024-01-15', null, null, 'Missing malpractice insurance documents', 90, null),
((SELECT id FROM public.credentialing_doctors WHERE last_name = 'Lee' LIMIT 1), 'under_review', 'renewal', 'Aetna', 'standard', '2024-01-10', '2024-01-20', null, 'All documents submitted', 60, '2025-01-10'),
((SELECT id FROM public.credentialing_doctors WHERE last_name = 'Kim' LIMIT 1), 'approved', 'initial', 'United Healthcare', 'standard', '2024-01-08', '2024-01-15', '2024-02-01', 'Successfully credentialed', 45, '2025-02-01');

-- Add some file vault test data
INSERT INTO public.file_vault (client_id, filename, original_filename, file_type, file_size, folder_path, description, uploaded_by, is_confidential) VALUES
((SELECT id FROM public.clients WHERE name = 'Valley Medical Group' LIMIT 1), 'contract_2024_vmg.pdf', 'Valley Medical Contract 2024.pdf', 'application/pdf', 2048576, '/contracts', 'Annual service contract', 'admin@company.com', true),
((SELECT id FROM public.clients WHERE name = 'Coastal Orthopedics' LIMIT 1), 'insurance_forms_coastal.xlsx', 'Insurance Forms - Coastal Ortho.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 1024000, '/forms', 'Updated insurance forms', 'admin@company.com', false),
((SELECT id FROM public.clients WHERE name = 'Downtown Dental' LIMIT 1), 'patient_demographics_dd.csv', 'Patient Demographics - Downtown Dental.csv', 'text/csv', 512000, '/demographics', 'Patient demographic data export', 'admin@company.com', true);

-- Add some invoices test data
INSERT INTO public.invoices (client_id, invoice_number, billing_period_start, billing_period_end, total_collections, fee_percentage, invoice_amount, status, sent_date, due_date, notes) VALUES
((SELECT id FROM public.clients WHERE name = 'Valley Medical Group' LIMIT 1), 'INV-2024-001', '2024-11-01', '2024-11-30', 12500.00, 8.0, 1000.00, 'paid', '2024-12-01', '2024-12-31', 'November billing cycle'),
((SELECT id FROM public.clients WHERE name = 'Coastal Orthopedics' LIMIT 1), 'INV-2024-002', '2024-11-01', '2024-11-30', 18750.00, 7.5, 1406.25, 'sent', '2024-12-01', '2024-12-31', 'November billing cycle'),
((SELECT id FROM public.clients WHERE name = 'Metro Cardiology Associates' LIMIT 1), 'INV-2024-003', '2024-11-01', '2024-11-30', 22000.00, 8.5, 1870.00, 'draft', null, null, 'November billing cycle - pending review');

-- Add some claims test data with unique claim numbers
INSERT INTO public.claims (client_id, claim_number, patient_name, insurance_company, service_date, submission_date, amount, status, payment_date, payment_amount, denial_reason, notes, follow_up_required) VALUES
((SELECT id FROM public.clients WHERE name = 'Valley Medical Group' LIMIT 1), 'CLM-2024-101', 'John Doe', 'Blue Cross Blue Shield', '2024-11-15', '2024-11-20', 250.00, 'paid', '2024-12-10', 250.00, null, 'Annual physical exam', false),
((SELECT id FROM public.clients WHERE name = 'Coastal Orthopedics' LIMIT 1), 'CLM-2024-102', 'Jane Smith', 'United Healthcare', '2024-11-18', '2024-11-22', 1200.00, 'denied', null, null, 'Prior authorization required', 'Need to obtain prior auth and resubmit', true),
((SELECT id FROM public.clients WHERE name = 'Pediatric Care Center' LIMIT 1), 'CLM-2024-103', 'Tommy Wilson', 'Aetna', '2024-11-20', '2024-11-25', 150.00, 'pending', null, null, null, 'Well-child visit', false),
((SELECT id FROM public.clients WHERE name = 'Metro Cardiology Associates' LIMIT 1), 'CLM-2024-104', 'Mary Johnson', 'Blue Cross Blue Shield', '2024-11-22', '2024-11-25', 450.00, 'approved', null, null, null, 'Cardiac consultation', false),
((SELECT id FROM public.clients WHERE name = 'Westside Dermatology' LIMIT 1), 'CLM-2024-105', 'Robert Brown', 'Cigna', '2024-11-25', '2024-11-28', 300.00, 'submitted', null, null, null, 'Skin biopsy', false);
