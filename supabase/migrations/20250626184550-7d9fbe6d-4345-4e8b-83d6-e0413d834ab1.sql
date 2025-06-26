
-- Create clients table for medical practices
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  practice_type TEXT,  -- Primary Care, Cardiology, etc.
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, pending
  contract_start_date DATE,
  monthly_revenue DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create claims table for tracking medical claims
CREATE TABLE public.claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  claim_number TEXT UNIQUE NOT NULL,
  patient_name TEXT NOT NULL,
  service_date DATE NOT NULL,
  submission_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted', -- submitted, approved, denied, pending, paid
  insurance_company TEXT NOT NULL,
  denial_reason TEXT,
  payment_date DATE,
  payment_amount DECIMAL(10,2),
  follow_up_required BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing_performance table for KPI tracking
CREATE TABLE public.billing_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  month_year DATE NOT NULL, -- First day of the month for the period
  total_claims INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  approved_claims INTEGER NOT NULL DEFAULT 0,
  denied_claims INTEGER NOT NULL DEFAULT 0,
  pending_claims INTEGER NOT NULL DEFAULT 0,
  collection_rate DECIMAL(5,2), -- Percentage
  denial_rate DECIMAL(5,2), -- Percentage
  average_days_to_payment DECIMAL(5,1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, month_year)
);

-- Create pipeline table for prospect management
CREATE TABLE public.pipeline_prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  practice_type TEXT,
  estimated_monthly_revenue DECIMAL(10,2),
  stage TEXT NOT NULL DEFAULT 'lead', -- lead, contacted, proposal_sent, negotiation, closed_won, closed_lost
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high
  source TEXT, -- referral, website, cold_call, etc.
  last_contact_date DATE,
  next_follow_up_date DATE,
  probability INTEGER DEFAULT 25, -- 0-100%
  notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_claims_client_id ON public.claims(client_id);
CREATE INDEX idx_claims_status ON public.claims(status);
CREATE INDEX idx_claims_submission_date ON public.claims(submission_date);
CREATE INDEX idx_billing_performance_client_month ON public.billing_performance(client_id, month_year);
CREATE INDEX idx_pipeline_stage ON public.pipeline_prospects(stage);

-- Create updated_at triggers for new tables
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at
    BEFORE UPDATE ON public.claims
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_performance_updated_at
    BEFORE UPDATE ON public.billing_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_prospects_updated_at
    BEFORE UPDATE ON public.pipeline_prospects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert comprehensive test data for clients
INSERT INTO public.clients (name, email, phone, address, city, state, zip_code, practice_type, status, contract_start_date, monthly_revenue, notes) VALUES
('Metro Medical Group', 'billing@metromedical.com', '(555) 123-4567', '123 Healthcare Ave', 'Los Angeles', 'CA', '90210', 'Primary Care', 'active', '2024-01-15', 15420.00, 'Large multi-physician practice'),
('Sunrise Family Medicine', 'admin@sunrisefamily.com', '(555) 234-5678', '456 Family Way', 'Phoenix', 'AZ', '85001', 'Family Medicine', 'active', '2024-02-01', 12340.00, 'Growing family practice'),
('Downtown Cardiology', 'contact@downtowncardio.com', '(555) 345-6789', '789 Heart Blvd', 'Dallas', 'TX', '75201', 'Cardiology', 'active', '2024-03-10', 9850.00, 'Specialized cardiology practice'),
('Pediatric Associates', 'info@pediatricassoc.com', '(555) 456-7890', '321 Kids St', 'Miami', 'FL', '33101', 'Pediatrics', 'active', '2024-01-05', 8720.00, 'Pediatric specialists'),
('Central Orthopedics', 'billing@centralortho.com', '(555) 567-8901', '654 Bone Ave', 'Chicago', 'IL', '60601', 'Orthopedics', 'active', '2024-04-01', 18500.00, 'Orthopedic surgery center'),
('Wellness Clinic', 'admin@wellnessclinic.com', '(555) 678-9012', '987 Health Plaza', 'Denver', 'CO', '80201', 'General Practice', 'pending', '2024-12-01', 7200.00, 'New client starting soon');

-- Insert test data for claims
INSERT INTO public.claims (client_id, claim_number, patient_name, service_date, submission_date, amount, status, insurance_company, payment_date, payment_amount, notes) VALUES
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), 'CLM-2024-001', 'John Smith', '2024-11-01', '2024-11-05', 250.00, 'paid', 'Blue Cross Blue Shield', '2024-11-20', 250.00, 'Routine checkup'),
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), 'CLM-2024-002', 'Jane Doe', '2024-11-03', '2024-11-07', 180.00, 'approved', 'Aetna', NULL, NULL, 'Lab work'),
((SELECT id FROM public.clients WHERE name = 'Sunrise Family Medicine'), 'CLM-2024-003', 'Bob Johnson', '2024-11-02', '2024-11-06', 320.00, 'denied', 'Humana', NULL, NULL, 'Prior authorization required'),
((SELECT id FROM public.clients WHERE name = 'Downtown Cardiology'), 'CLM-2024-004', 'Alice Brown', '2024-11-04', '2024-11-08', 850.00, 'pending', 'Cigna', NULL, NULL, 'Cardiac stress test'),
((SELECT id FROM public.clients WHERE name = 'Pediatric Associates'), 'CLM-2024-005', 'Tommy Wilson', '2024-11-01', '2024-11-05', 150.00, 'paid', 'United Healthcare', '2024-11-18', 150.00, 'Vaccination'),
((SELECT id FROM public.clients WHERE name = 'Central Orthopedics'), 'CLM-2024-006', 'Sarah Davis', '2024-10-28', '2024-11-01', 1250.00, 'approved', 'Medicare', NULL, NULL, 'Knee surgery consultation'),
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), 'CLM-2024-007', 'Mike Taylor', '2024-11-05', '2024-11-09', 420.00, 'submitted', 'Blue Cross Blue Shield', NULL, NULL, 'Physical therapy evaluation'),
((SELECT id FROM public.clients WHERE name = 'Sunrise Family Medicine'), 'CLM-2024-008', 'Lisa Anderson', '2024-11-06', '2024-11-10', 280.00, 'pending', 'Aetna', NULL, NULL, 'Annual wellness visit');

-- Insert billing performance data for the last 6 months
INSERT INTO public.billing_performance (client_id, month_year, total_claims, total_revenue, approved_claims, denied_claims, pending_claims, collection_rate, denial_rate, average_days_to_payment) VALUES
-- Metro Medical Group
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), '2024-06-01', 45, 15420.00, 42, 2, 1, 94.2, 4.4, 18.5),
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), '2024-07-01', 48, 16200.00, 44, 3, 1, 93.8, 6.2, 19.2),
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), '2024-08-01', 52, 17100.00, 49, 2, 1, 95.1, 3.8, 17.8),
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), '2024-09-01', 47, 15800.00, 43, 3, 1, 92.5, 6.4, 20.1),
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), '2024-10-01', 49, 16500.00, 46, 2, 1, 94.8, 4.1, 18.9),
((SELECT id FROM public.clients WHERE name = 'Metro Medical Group'), '2024-11-01', 43, 14950.00, 39, 2, 2, 93.2, 4.7, 19.5),

-- Sunrise Family Medicine
((SELECT id FROM public.clients WHERE name = 'Sunrise Family Medicine'), '2024-06-01', 38, 12340.00, 35, 2, 1, 92.1, 5.3, 22.1),
((SELECT id FROM public.clients WHERE name = 'Sunrise Family Medicine'), '2024-07-01', 41, 13100.00, 37, 3, 1, 90.8, 7.3, 23.5),
((SELECT id FROM public.clients WHERE name = 'Sunrise Family Medicine'), '2024-08-01', 39, 12800.00, 36, 2, 1, 93.6, 5.1, 21.2),
((SELECT id FROM public.clients WHERE name = 'Sunrise Family Medicine'), '2024-09-01', 42, 13450.00, 38, 3, 1, 91.4, 7.1, 22.8),
((SELECT id FROM public.clients WHERE name = 'Sunrise Family Medicine'), '2024-10-01', 40, 13000.00, 37, 2, 1, 94.2, 5.0, 20.9),
((SELECT id FROM public.clients WHERE name = 'Sunrise Family Medicine'), '2024-11-01', 36, 11800.00, 33, 2, 1, 92.8, 5.6, 21.7),

-- Downtown Cardiology
((SELECT id FROM public.clients WHERE name = 'Downtown Cardiology'), '2024-06-01', 29, 9850.00, 26, 2, 1, 89.7, 6.9, 25.3),
((SELECT id FROM public.clients WHERE name = 'Downtown Cardiology'), '2024-07-01', 31, 10200.00, 27, 3, 1, 87.1, 9.7, 26.8),
((SELECT id FROM public.clients WHERE name = 'Downtown Cardiology'), '2024-08-01', 28, 9500.00, 25, 2, 1, 91.2, 7.1, 24.1),
((SELECT id FROM public.clients WHERE name = 'Downtown Cardiology'), '2024-09-01', 32, 10800.00, 28, 3, 1, 88.9, 9.4, 25.9),
((SELECT id FROM public.clients WHERE name = 'Downtown Cardiology'), '2024-10-01', 30, 10100.00, 27, 2, 1, 90.5, 6.7, 24.7),
((SELECT id FROM public.clients WHERE name = 'Downtown Cardiology'), '2024-11-01', 27, 9200.00, 24, 2, 1, 89.8, 7.4, 25.2);

-- Insert pipeline prospects
INSERT INTO public.pipeline_prospects (name, email, phone, practice_type, estimated_monthly_revenue, stage, priority, source, last_contact_date, next_follow_up_date, probability, notes, assigned_to) VALUES
('Valley Medical Center', 'contact@valleymedical.com', '(555) 111-2222', 'Multi-Specialty', 25000.00, 'proposal_sent', 'high', 'referral', '2024-11-15', '2024-11-25', 75, 'Very interested, reviewing contract terms', 'John Sales'),
('Coastal Family Practice', 'admin@coastalfamily.com', '(555) 222-3333', 'Family Medicine', 8500.00, 'negotiation', 'high', 'website', '2024-11-20', '2024-11-27', 85, 'Price negotiations ongoing', 'Sarah Manager'),
('Mountain View Dermatology', 'info@mountainderm.com', '(555) 333-4444', 'Dermatology', 12000.00, 'contacted', 'medium', 'cold_call', '2024-11-10', '2024-11-30', 40, 'Interested but evaluating options', 'Mike Rep'),
('Riverside Urgent Care', 'billing@riversideurgent.com', '(555) 444-5555', 'Urgent Care', 18000.00, 'lead', 'medium', 'referral', '2024-11-05', '2024-12-01', 25, 'Initial contact made', 'John Sales'),
('Sunset Psychiatry', 'contact@sunsetpsych.com', '(555) 555-6666', 'Psychiatry', 9200.00, 'closed_won', 'high', 'referral', '2024-11-01', NULL, 100, 'Contract signed, starting January 2025', 'Sarah Manager'),
('Downtown ENT Specialists', 'admin@downtownent.com', '(555) 666-7777', 'ENT', 14500.00, 'closed_lost', 'medium', 'website', '2024-10-15', NULL, 0, 'Went with competitor', 'Mike Rep');

-- Enable RLS on all new tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_prospects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all authenticated users to access data for now - adjust as needed)
CREATE POLICY "Authenticated users can view clients" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage clients" ON public.clients FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view claims" ON public.claims FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage claims" ON public.claims FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view billing performance" ON public.billing_performance FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage billing performance" ON public.billing_performance FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view pipeline prospects" ON public.pipeline_prospects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage pipeline prospects" ON public.pipeline_prospects FOR ALL TO authenticated USING (true);
