
-- Create profiles table for storing user business information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, business_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    'Excel Billing'
  );
  RETURN new;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add sample data to spreadsheet_imports table
INSERT INTO public.spreadsheet_imports (
  filename, 
  imported_by_username, 
  records_imported, 
  file_size, 
  notes,
  status
) VALUES 
('client_data_2024.csv', 'admin@excelbilling.com', 150, 2048, 'Monthly client import', 'completed'),
('claims_january.xlsx', 'billing@excelbilling.com', 89, 1536, 'January claims data', 'completed'),
('insurance_providers.csv', 'admin@excelbilling.com', 45, 1024, 'Updated insurance provider list', 'completed'),
('patient_records.xlsx', 'staff@excelbilling.com', 203, 3072, 'Patient demographic updates', 'completed'),
('billing_codes_2024.csv', 'admin@excelbilling.com', 67, 896, 'New billing codes for 2024', 'completed');
