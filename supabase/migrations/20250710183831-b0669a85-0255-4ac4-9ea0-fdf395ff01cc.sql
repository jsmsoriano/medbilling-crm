-- Add sample team members for assignments  
INSERT INTO public.team_members (name, email, role, is_active) VALUES
('Sarah Johnson', 'sarah.johnson@company.com', 'Account Manager', true),
('Mike Chen', 'mike.chen@company.com', 'Senior Account Manager', true),
('Lisa Rodriguez', 'lisa.rodriguez@company.com', 'Claims Specialist', true),
('David Kim', 'david.kim@company.com', 'AR Specialist', true),
('Emily Foster', 'emily.foster@company.com', 'Credentialing Coordinator', true),
('James Wilson', 'james.wilson@company.com', 'Billing Manager', true)
ON CONFLICT (email) DO NOTHING;