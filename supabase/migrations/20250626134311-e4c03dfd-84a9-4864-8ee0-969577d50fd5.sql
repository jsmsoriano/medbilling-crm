
-- Create credentialing_doctors table to store doctor information
CREATE TABLE public.credentialing_doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  npi_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  license_number TEXT NOT NULL,
  license_state TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  board_certification TEXT,
  board_expiry DATE,
  dea_number TEXT,
  dea_expiry DATE,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credentialing_applications table to track the credentialing process
CREATE TABLE public.credentialing_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES public.credentialing_doctors(id) ON DELETE CASCADE NOT NULL,
  insurance_company TEXT NOT NULL,
  application_type TEXT NOT NULL DEFAULT 'initial', -- initial, revalidation, update
  status TEXT NOT NULL DEFAULT 'pending_documents', -- pending_documents, documents_complete, submitted, under_review, follow_up_required, approved, denied, expired
  priority TEXT NOT NULL DEFAULT 'standard', -- urgent, high, standard, low
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  submission_date DATE,
  approval_date DATE,
  expiry_date DATE,
  estimated_completion_days INTEGER DEFAULT 90,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credentialing_documents table to track required documents
CREATE TABLE public.credentialing_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.credentialing_applications(id) ON DELETE CASCADE NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL, -- license, certification, education, malpractice, cv, etc
  required BOOLEAN NOT NULL DEFAULT true,
  received BOOLEAN NOT NULL DEFAULT false,
  received_date DATE,
  expiry_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create credentialing_timeline table to track process history
CREATE TABLE public.credentialing_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.credentialing_applications(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_credentialing_doctors_npi ON public.credentialing_doctors(npi_number);
CREATE INDEX idx_credentialing_applications_doctor_id ON public.credentialing_applications(doctor_id);
CREATE INDEX idx_credentialing_applications_status ON public.credentialing_applications(status);
CREATE INDEX idx_credentialing_documents_application_id ON public.credentialing_documents(application_id);
CREATE INDEX idx_credentialing_timeline_application_id ON public.credentialing_timeline(application_id);

-- Create trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_credentialing_doctors_updated_at
    BEFORE UPDATE ON public.credentialing_doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentialing_applications_updated_at
    BEFORE UPDATE ON public.credentialing_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentialing_documents_updated_at
    BEFORE UPDATE ON public.credentialing_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO public.credentialing_timeline (application_id, status, notes, created_by)
        VALUES (NEW.id, NEW.status, 'Status changed from ' || COALESCE(OLD.status, 'null') || ' to ' || NEW.status, 'system');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_application_status_change
    AFTER UPDATE ON public.credentialing_applications
    FOR EACH ROW
    EXECUTE FUNCTION log_status_change();

-- Insert sample data for testing
INSERT INTO public.credentialing_doctors (npi_number, first_name, last_name, specialty, license_number, license_state, license_expiry, email, phone, address, city, state, zip_code) VALUES
('1234567890', 'Dr. Sarah', 'Johnson', 'Cardiology', 'MD123456', 'CA', '2025-12-31', 'sarah.johnson@email.com', '555-0101', '123 Medical Ave', 'Los Angeles', 'CA', '90210'),
('2345678901', 'Dr. Michael', 'Chen', 'Orthopedics', 'MD234567', 'NY', '2026-06-30', 'michael.chen@email.com', '555-0102', '456 Health St', 'New York', 'NY', '10001'),
('3456789012', 'Dr. Emily', 'Rodriguez', 'Pediatrics', 'MD345678', 'TX', '2025-09-15', 'emily.rodriguez@email.com', '555-0103', '789 Care Blvd', 'Houston', 'TX', '77001');

-- Insert sample applications
INSERT INTO public.credentialing_applications (doctor_id, insurance_company, status, priority, application_date) VALUES
((SELECT id FROM public.credentialing_doctors WHERE npi_number = '1234567890'), 'Blue Cross Blue Shield', 'under_review', 'high', '2024-11-01'),
((SELECT id FROM public.credentialing_doctors WHERE npi_number = '1234567890'), 'Aetna', 'approved', 'standard', '2024-10-15'),
((SELECT id FROM public.credentialing_doctors WHERE npi_number = '2345678901'), 'Humana', 'pending_documents', 'urgent', '2024-12-01'),
((SELECT id FROM public.credentialing_doctors WHERE npi_number = '3456789012'), 'Cigna', 'submitted', 'standard', '2024-11-20');
