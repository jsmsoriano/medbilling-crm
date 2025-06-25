
-- Create table for spreadsheet import history
CREATE TABLE public.spreadsheet_imports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  import_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'completed',
  records_imported INTEGER NOT NULL DEFAULT 0,
  imported_by_username TEXT NOT NULL,
  file_size INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.spreadsheet_imports ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing import history (accessible to all authenticated users)
CREATE POLICY "All authenticated users can view import history" 
  ON public.spreadsheet_imports 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy for creating import records (authenticated users only)
CREATE POLICY "Authenticated users can create import records" 
  ON public.spreadsheet_imports 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy for updating import records (authenticated users only)
CREATE POLICY "Authenticated users can update import records" 
  ON public.spreadsheet_imports 
  FOR UPDATE 
  TO authenticated
  USING (true);
