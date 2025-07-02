import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface SubscriptionContextType {
  subscriptionTier: 'starter' | 'professional' | 'growth';
  isActive: boolean;
  loading: boolean;
  subscriptionFeatures: Record<string, number | null>;
  canAccessFeature: (requiredTier?: 'starter' | 'professional' | 'growth') => boolean;
  getFeatureLimit: (featureName: string) => number | null;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscriptionTier: 'starter',
  isActive: false,
  loading: true,
  subscriptionFeatures: {},
  canAccessFeature: () => false,
  getFeatureLimit: () => null,
  refreshSubscription: async () => {},
});

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user, isBypassed } = useAuth();
  const [subscriptionTier, setSubscriptionTier] = useState<'starter' | 'professional' | 'growth'>('starter');
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscriptionFeatures, setSubscriptionFeatures] = useState<Record<string, number | null>>({});

  const fetchSubscriptionData = async () => {
    if (!user && !isBypassed) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // If bypassed, set default professional tier
      if (isBypassed) {
        setSubscriptionTier('professional');
        setIsActive(true);
        await fetchFeatures('professional');
        return;
      }

      // Fetch user profile with subscription info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, is_active')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching subscription:', profileError);
        return;
      }

      if (profile) {
        setSubscriptionTier(profile.subscription_tier || 'starter');
        setIsActive(profile.is_active || false);
        await fetchFeatures(profile.subscription_tier || 'starter');
      }
    } catch (error) {
      console.error('Error in fetchSubscriptionData:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatures = async (tier: 'starter' | 'professional' | 'growth') => {
    try {
      const { data: features, error } = await supabase
        .from('subscription_features')
        .select('feature_name, feature_limit')
        .eq('tier', tier);

      if (error) {
        console.error('Error fetching features:', error);
        return;
      }

      const featuresMap = features.reduce((acc, feature) => {
        acc[feature.feature_name] = feature.feature_limit;
        return acc;
      }, {} as Record<string, number | null>);

      setSubscriptionFeatures(featuresMap);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const canAccessFeature = (requiredTier?: 'starter' | 'professional' | 'growth'): boolean => {
    if (!requiredTier) return true;
    if (!isActive && !isBypassed) return false;
    
    const tierLevels = {
      starter: 1,
      professional: 2,
      growth: 3
    };
    
    return tierLevels[subscriptionTier] >= tierLevels[requiredTier];
  };

  const getFeatureLimit = (featureName: string): number | null => {
    return subscriptionFeatures[featureName] || null;
  };

  const refreshSubscription = async () => {
    await fetchSubscriptionData();
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [user, isBypassed]);

  const value = {
    subscriptionTier,
    isActive: isActive || isBypassed,
    loading,
    subscriptionFeatures,
    canAccessFeature,
    getFeatureLimit,
    refreshSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};