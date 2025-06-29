
-- Create tasks table for the Task & Follow-Up Manager
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'weekly', 'monthly', 'quarterly', 'yearly'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by TEXT
);

-- Create team_members table for Team Productivity Panel
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_assignments table to link team members to clients
CREATE TABLE public.client_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  team_member_id UUID REFERENCES public.team_members(id) NOT NULL,
  role TEXT, -- 'primary', 'secondary', 'manager'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, team_member_id)
);

-- Create file_vault table for Basic File Vault (non-clinical files only)
CREATE TABLE public.file_vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  folder_path TEXT,
  description TEXT,
  uploaded_by TEXT NOT NULL,
  is_confidential BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table for Reporting & Invoicing
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  invoice_number TEXT NOT NULL UNIQUE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  total_collections NUMERIC(10,2) NOT NULL DEFAULT 0,
  fee_percentage NUMERIC(5,2) NOT NULL,
  invoice_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  sent_date DATE,
  due_date DATE,
  paid_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add new columns to existing clients table for contract management
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS office_contact_name TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS contract_percentage NUMERIC(5,2);
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS billing_cycle_start_date DATE;

-- Create indexes for better performance
CREATE INDEX idx_tasks_client_id ON public.tasks(client_id);
CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_client_assignments_client_id ON public.client_assignments(client_id);
CREATE INDEX idx_client_assignments_team_member_id ON public.client_assignments(team_member_id);
CREATE INDEX idx_file_vault_client_id ON public.file_vault(client_id);
CREATE INDEX idx_invoices_client_id ON public.invoices(client_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);

-- Add RLS policies for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.tasks FOR DELETE USING (true);

-- Add RLS policies for team_members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.team_members FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.team_members FOR DELETE USING (true);

-- Add RLS policies for client_assignments
ALTER TABLE public.client_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.client_assignments FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.client_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.client_assignments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.client_assignments FOR DELETE USING (true);

-- Add RLS policies for file_vault
ALTER TABLE public.file_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.file_vault FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.file_vault FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.file_vault FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.file_vault FOR DELETE USING (true);

-- Add RLS policies for invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON public.invoices FOR DELETE USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all new tables
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_file_vault_updated_at BEFORE UPDATE ON public.file_vault FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert some sample team members for testing
INSERT INTO public.team_members (name, email, role) VALUES
('John Smith', 'john.smith@company.com', 'Billing Manager'),
('Sarah Johnson', 'sarah.johnson@company.com', 'Claims Specialist'),
('Mike Wilson', 'mike.wilson@company.com', 'Collections Specialist');
