-- Create subscription enum
CREATE TYPE public.subscription_tier AS ENUM ('starter', 'professional', 'growth');

-- Update profiles table to include subscription information
ALTER TABLE public.profiles 
ADD COLUMN subscription_tier subscription_tier DEFAULT 'starter',
ADD COLUMN subscription_start_date timestamp with time zone DEFAULT now(),
ADD COLUMN subscription_end_date timestamp with time zone,
ADD COLUMN is_active boolean DEFAULT true;

-- Create subscription features table to define what each tier includes
CREATE TABLE public.subscription_features (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tier subscription_tier NOT NULL,
    feature_name text NOT NULL,
    feature_limit integer, -- NULL means unlimited
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(tier, feature_name)
);

-- Insert default features for each subscription tier
INSERT INTO public.subscription_features (tier, feature_name, feature_limit) VALUES
-- Starter tier limits
('starter', 'max_clients', 5),
('starter', 'max_claims_per_month', 100),
('starter', 'max_users', 1),
('starter', 'credentialing_applications', 2),
('starter', 'file_storage_gb', 1),

-- Professional tier limits  
('professional', 'max_clients', 25),
('professional', 'max_claims_per_month', 1000),
('professional', 'max_users', 5),
('professional', 'credentialing_applications', 10),
('professional', 'file_storage_gb', 10),

-- Growth tier - unlimited/high limits
('growth', 'max_clients', NULL), -- unlimited
('growth', 'max_claims_per_month', NULL), -- unlimited
('growth', 'max_users', 25),
('growth', 'credentialing_applications', NULL), -- unlimited
('growth', 'file_storage_gb', 100);

-- Enable RLS on subscription features
ALTER TABLE public.subscription_features ENABLE ROW LEVEL SECURITY;

-- Create policy for subscription features
CREATE POLICY "Anyone can view subscription features" 
ON public.subscription_features 
FOR SELECT 
USING (true);

-- Create function to check user subscription features
CREATE OR REPLACE FUNCTION public.get_user_subscription_limit(user_id uuid, feature_name text)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT sf.feature_limit
  FROM public.profiles p
  JOIN public.subscription_features sf ON p.subscription_tier = sf.tier
  WHERE p.id = user_id 
    AND sf.feature_name = get_user_subscription_limit.feature_name
    AND p.is_active = true;
$$;