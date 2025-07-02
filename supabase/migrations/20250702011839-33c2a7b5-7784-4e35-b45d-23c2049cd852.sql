-- Create payments table for tracking claim payments
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
  payment_amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT DEFAULT 'check',
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Authenticated users can view payments" 
ON public.payments 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage payments" 
ON public.payments 
FOR ALL 
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update claims table to add more status options and AR aging fields
ALTER TABLE public.claims 
ADD COLUMN IF NOT EXISTS balance_due NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS days_outstanding INTEGER,
ADD COLUMN IF NOT EXISTS aging_bucket TEXT GENERATED ALWAYS AS (
  CASE 
    WHEN days_outstanding <= 30 THEN '0-30'
    WHEN days_outstanding <= 60 THEN '31-60'
    WHEN days_outstanding <= 90 THEN '61-90'
    ELSE '90+'
  END
) STORED;

-- Create function to calculate days outstanding and balance due
CREATE OR REPLACE FUNCTION public.update_claim_ar_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate days outstanding from submission date
  NEW.days_outstanding = COALESCE(
    DATE_PART('day', CURRENT_DATE - NEW.submission_date)::INTEGER, 
    0
  );
  
  -- Calculate balance due (claim amount - total payments)
  NEW.balance_due = NEW.amount - COALESCE(
    (SELECT SUM(payment_amount) 
     FROM public.payments 
     WHERE claim_id = NEW.id), 
    0
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update AR fields
CREATE TRIGGER update_claim_ar_fields_trigger
BEFORE INSERT OR UPDATE ON public.claims
FOR EACH ROW
EXECUTE FUNCTION public.update_claim_ar_fields();

-- Create function to update claim after payment
CREATE OR REPLACE FUNCTION public.update_claim_after_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the parent claim's balance and status
  UPDATE public.claims 
  SET 
    payment_amount = (
      SELECT SUM(payment_amount) 
      FROM public.payments 
      WHERE claim_id = NEW.claim_id
    ),
    payment_date = (
      SELECT MAX(payment_date) 
      FROM public.payments 
      WHERE claim_id = NEW.claim_id
    ),
    status = CASE 
      WHEN (SELECT SUM(payment_amount) FROM public.payments WHERE claim_id = NEW.claim_id) >= amount 
      THEN 'paid'
      WHEN (SELECT SUM(payment_amount) FROM public.payments WHERE claim_id = NEW.claim_id) > 0 
      THEN 'partially_paid'
      ELSE status
    END
  WHERE id = NEW.claim_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for payment updates
CREATE TRIGGER update_claim_after_payment_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_claim_after_payment();

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_claims_aging_bucket ON public.claims(aging_bucket);
CREATE INDEX IF NOT EXISTS idx_claims_client_id_new ON public.claims(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_claim_id ON public.payments(claim_id);