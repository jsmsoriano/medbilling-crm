-- Add sample credentialing doctors for testing
INSERT INTO public.credentialing_doctors (first_name, last_name, npi_number, license_number, license_state, license_expiry, specialty, email, phone, address, city, state, zip_code, board_certification, board_expiry, dea_number, dea_expiry) VALUES
('Dr. Jennifer', 'Williams', '1234567890', 'MD12345', 'CA', '2025-06-30', 'Internal Medicine', 'j.williams@example.com', '555-2001', '123 Medical Ave', 'Los Angeles', 'CA', '90210', 'American Board of Internal Medicine', '2026-12-31', 'BW1234567', '2025-08-15'),
('Dr. Michael', 'Brown', '2345678901', 'MD23456', 'NY', '2025-09-15', 'Cardiology', 'm.brown@example.com', '555-2002', '456 Heart St', 'New York', 'NY', '10001', 'American Board of Cardiology', '2027-03-20', 'BB2345678', '2025-11-30'),
('Dr. Sarah', 'Davis', '3456789012', 'MD34567', 'TX', '2025-12-01', 'Pediatrics', 's.davis@example.com', '555-2003', '789 Kids Lane', 'Houston', 'TX', '77001', 'American Board of Pediatrics', '2026-07-10', 'BD3456789', '2025-10-20'),
('Dr. Robert', 'Miller', '4567890123', 'MD45678', 'FL', '2025-04-20', 'Orthopedics', 'r.miller@example.com', '555-2004', '321 Bone Blvd', 'Miami', 'FL', '33101', 'American Board of Orthopedic Surgery', '2026-09-15', 'BM4567890', '2025-12-05'),
('Dr. Lisa', 'Wilson', '5678901234', 'MD56789', 'IL', '2025-07-10', 'Dermatology', 'l.wilson@example.com', '555-2005', '654 Skin St', 'Chicago', 'IL', '60601', 'American Board of Dermatology', '2027-01-25', 'BW5678901', '2025-09-30')
ON CONFLICT (id) DO NOTHING;

-- Add sample credentialing applications
INSERT INTO public.credentialing_applications (doctor_id, insurance_company, application_type, status, priority, application_date, submission_date, estimated_completion_days, notes) VALUES
((SELECT id FROM public.credentialing_doctors WHERE last_name = 'Williams' LIMIT 1), 'Blue Cross Blue Shield', 'initial', 'pending_documents', 'high', '2024-11-01', '2024-11-15', 90, 'Missing board certification copy'),
((SELECT id FROM public.credentialing_doctors WHERE last_name = 'Brown' LIMIT 1), 'Aetna', 'revalidation', 'in_review', 'standard', '2024-10-15', '2024-11-01', 60, 'Standard revalidation process'),
((SELECT id FROM public.credentialing_doctors WHERE last_name = 'Davis' LIMIT 1), 'United Healthcare', 'initial', 'approved', 'standard', '2024-09-01', '2024-09-20', 75, 'Approved - effective Jan 1, 2025'),
((SELECT id FROM public.credentialing_doctors WHERE last_name = 'Miller' LIMIT 1), 'Cigna', 'initial', 'pending_submission', 'urgent', '2024-12-01', NULL, 45, 'Rush application for new practice'),
((SELECT id FROM public.credentialing_doctors WHERE last_name = 'Wilson' LIMIT 1), 'Medicare', 'revalidation', 'denied', 'standard', '2024-08-15', '2024-09-01', 90, 'Denied - incomplete documentation')
ON CONFLICT (id) DO NOTHING;

-- Add sample team members for assignments
INSERT INTO public.team_members (name, email, role, is_active) VALUES
('Sarah Johnson', 'sarah.johnson@company.com', 'Account Manager', true),
('Mike Chen', 'mike.chen@company.com', 'Senior Account Manager', true),
('Lisa Rodriguez', 'lisa.rodriguez@company.com', 'Claims Specialist', true),
('David Kim', 'david.kim@company.com', 'AR Specialist', true),
('Emily Foster', 'emily.foster@company.com', 'Credentialing Coordinator', true),
('James Wilson', 'james.wilson@company.com', 'Billing Manager', true)
ON CONFLICT (email) DO NOTHING;