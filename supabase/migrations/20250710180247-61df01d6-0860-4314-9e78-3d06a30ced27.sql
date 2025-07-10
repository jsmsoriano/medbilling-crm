-- Add more sample pipeline prospects for testing
INSERT INTO public.pipeline_prospects (name, email, phone, stage, priority, practice_type, estimated_monthly_revenue, assigned_to, source, probability, notes) VALUES
('Westside Pediatrics', 'admin@westsidepediatrics.com', '555-1001', 'lead', 'high', 'Pediatrics', 15000, 'Sarah Johnson', 'Referral', 75, 'Strong interest, scheduled demo'),
('Mountain View Orthopedics', 'contact@mvortho.com', '555-1002', 'qualified', 'medium', 'Orthopedics', 25000, 'Mike Chen', 'Website', 60, 'Needs 2-3 week timeline'),
('Valley Family Medicine', 'info@valleyfam.com', '555-1003', 'proposal', 'high', 'Family Medicine', 18000, 'Sarah Johnson', 'Cold Call', 80, 'Ready to sign contract'),
('Urban Dermatology', 'hello@urbanderm.com', '555-1004', 'negotiation', 'high', 'Dermatology', 22000, 'Mike Chen', 'Trade Show', 90, 'Final pricing discussion'),
('Community Health Center', 'admin@communityhealth.org', '555-1005', 'lead', 'low', 'Community Health', 8000, 'Sarah Johnson', 'Referral', 25, 'Budget constraints'),
('Elite Sports Medicine', 'contact@elitesports.com', '555-1006', 'qualified', 'medium', 'Sports Medicine', 30000, 'Mike Chen', 'LinkedIn', 65, 'Expanding practice'),
('Sunshine Obstetrics', 'info@sunshineob.com', '555-1007', 'proposal', 'high', 'Obstetrics', 28000, 'Sarah Johnson', 'Referral', 85, 'Impressed with demo'),
('Downtown Psychiatry', 'admin@downtownpsych.com', '555-1008', 'lead', 'medium', 'Psychiatry', 12000, 'Mike Chen', 'Google Ads', 40, 'Initial inquiry'),
('Regional Cancer Center', 'contact@regionalcancer.org', '555-1009', 'qualified', 'high', 'Oncology', 45000, 'Sarah Johnson', 'Trade Show', 70, 'Large practice opportunity'),
('Coastal Urgent Care', 'info@coastalurgent.com', '555-1010', 'negotiation', 'medium', 'Urgent Care', 20000, 'Mike Chen', 'Cold Call', 75, 'Contract review phase')
ON CONFLICT (id) DO NOTHING;

-- Add more sample tasks for testing
INSERT INTO public.tasks (title, description, status, priority, assigned_to, due_date, task_type, created_by, client_id) VALUES
('Follow up on denied claim CLM-2024-002', 'Review denial reason and prepare appeal documentation', 'open', 'high', 'Claims Team', '2024-12-20', 'follow_up', 'system', '550e8400-e29b-41d4-a716-446655440001'),
('Update patient insurance information', 'Verify and update insurance details for recent changes', 'in_progress', 'medium', 'Admin Team', '2024-12-18', 'administrative', 'system', '550e8400-e29b-41d4-a716-446655440002'),
('Schedule credentialing renewal', 'Initiate renewal process for expiring credentials', 'open', 'high', 'Credentialing Team', '2024-12-22', 'credentialing', 'system', '550e8400-e29b-41d4-a716-446655440003'),
('Reconcile payment batch PB-2024-150', 'Match payments with corresponding claims in system', 'completed', 'medium', 'AR Team', '2024-12-15', 'reconciliation', 'system', '550e8400-e29b-41d4-a716-446655440001'),
('Submit prior authorization request', 'Process PA request for patient procedure', 'open', 'high', 'Auth Team', '2024-12-19', 'authorization', 'system', '550e8400-e29b-41d4-a716-446655440002'),
('Monthly client report preparation', 'Compile performance metrics for client review', 'in_progress', 'medium', 'Reporting Team', '2024-12-25', 'reporting', 'system', '550e8400-e29b-41d4-a716-446655440003'),
('Insurance verification for new patients', 'Verify coverage for upcoming appointments', 'open', 'medium', 'Front Office', '2024-12-21', 'verification', 'system', '550e8400-e29b-41d4-a716-446655440001'),
('Appeal denied claim CLM-2024-005', 'Submit formal appeal with additional documentation', 'open', 'high', 'Appeals Team', '2024-12-23', 'appeal', 'system', '550e8400-e29b-41d4-a716-446655440002'),
('Update fee schedule for 2025', 'Review and update billing rates for new year', 'completed', 'low', 'Billing Manager', '2024-12-10', 'administrative', 'system', '550e8400-e29b-41d4-a716-446655440003'),
('Quality audit preparation', 'Prepare documentation for quarterly audit', 'in_progress', 'medium', 'QA Team', '2024-12-30', 'audit', 'system', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

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