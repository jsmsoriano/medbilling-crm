-- Create data_sources table for storing configuration of different data sources
CREATE TABLE public.data_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('ftp', 'google_sheets', 'api', 'database', 'csv_upload')),
  configuration JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT NOT NULL DEFAULT 'system'
);

-- Enable Row Level Security
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

-- Create policies for data sources access
CREATE POLICY "Authenticated users can manage data sources" 
ON public.data_sources 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE TRIGGER update_data_sources_updated_at
BEFORE UPDATE ON public.data_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data sources
INSERT INTO public.data_sources (name, source_type, configuration, created_by) VALUES
  ('Main FTP Server', 'ftp', '{"host": "", "username": "", "password": "", "port": 21, "secure": false}', 'admin'),
  ('Claims Google Sheet', 'google_sheets', '{"sheet_id": "", "range": "A1:Z1000", "credentials": ""}', 'admin'),
  ('External API', 'api', '{"endpoint": "", "method": "GET", "headers": {}, "auth_type": "none"}', 'admin');