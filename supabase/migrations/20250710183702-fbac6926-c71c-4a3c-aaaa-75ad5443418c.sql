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

-- Add more sample tasks using existing client IDs
INSERT INTO public.tasks (title, description, status, priority, assigned_to, due_date, task_type, created_by, client_id) VALUES
('Follow up on denied claim CLM-2024-002', 'Review denial reason and prepare appeal documentation', 'open', 'high', 'Claims Team', '2024-12-20', 'follow_up', 'system', (SELECT id FROM clients LIMIT 1)),
('Update patient insurance information', 'Verify and update insurance details for recent changes', 'in_progress', 'medium', 'Admin Team', '2024-12-18', 'administrative', 'system', (SELECT id FROM clients OFFSET 1 LIMIT 1)),
('Schedule credentialing renewal', 'Initiate renewal process for expiring credentials', 'open', 'high', 'Credentialing Team', '2024-12-22', 'credentialing', 'system', (SELECT id FROM clients OFFSET 2 LIMIT 1)),
('Reconcile payment batch PB-2024-150', 'Match payments with corresponding claims in system', 'completed', 'medium', 'AR Team', '2024-12-15', 'reconciliation', 'system', (SELECT id FROM clients LIMIT 1)),
('Submit prior authorization request', 'Process PA request for patient procedure', 'open', 'high', 'Auth Team', '2024-12-19', 'authorization', 'system', (SELECT id FROM clients OFFSET 1 LIMIT 1)),
('Monthly client report preparation', 'Compile performance metrics for client review', 'in_progress', 'medium', 'Reporting Team', '2024-12-25', 'reporting', 'system', (SELECT id FROM clients OFFSET 2 LIMIT 1)),
('Insurance verification for new patients', 'Verify coverage for upcoming appointments', 'open', 'medium', 'Front Office', '2024-12-21', 'verification', 'system', (SELECT id FROM clients LIMIT 1)),
('Appeal denied claim CLM-2024-005', 'Submit formal appeal with additional documentation', 'open', 'high', 'Appeals Team', '2024-12-23', 'appeal', 'system', (SELECT id FROM clients OFFSET 1 LIMIT 1)),
('Update fee schedule for 2025', 'Review and update billing rates for new year', 'completed', 'low', 'Billing Manager', '2024-12-10', 'administrative', 'system', (SELECT id FROM clients OFFSET 2 LIMIT 1)),
('Quality audit preparation', 'Prepare documentation for quarterly audit', 'in_progress', 'medium', 'QA Team', '2024-12-30', 'audit', 'system', (SELECT id FROM clients LIMIT 1))
ON CONFLICT (id) DO NOTHING;