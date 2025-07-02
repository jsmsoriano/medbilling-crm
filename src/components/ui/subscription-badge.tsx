import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { Crown, Star, Zap } from 'lucide-react';

const subscriptionConfig = {
  starter: {
    label: 'Starter',
    icon: Star,
    variant: 'secondary' as const,
  },
  professional: {
    label: 'Professional',
    icon: Crown,
    variant: 'default' as const,
  },
  growth: {
    label: 'Growth',
    icon: Zap,
    variant: 'destructive' as const,
  },
};

interface SubscriptionBadgeProps {
  showIcon?: boolean;
  className?: string;
}

export const SubscriptionBadge = ({ showIcon = true, className }: SubscriptionBadgeProps) => {
  const { subscriptionTier, isActive, loading } = useSubscription();

  if (loading) {
    return <Badge variant="outline" className={className}>Loading...</Badge>;
  }

  if (!isActive) {
    return <Badge variant="outline" className={className}>Inactive</Badge>;
  }

  const config = subscriptionConfig[subscriptionTier];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={className}>
      {showIcon && <Icon className="w-3 h-3 mr-1" />}
      {config.label}
    </Badge>
  );
};