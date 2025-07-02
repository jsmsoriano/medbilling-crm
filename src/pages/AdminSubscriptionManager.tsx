import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Crown, Zap, Save, Plus } from 'lucide-react';

interface SubscriptionFeature {
  id: string;
  tier: 'starter' | 'professional' | 'growth';
  feature_name: string;
  feature_limit: number | null;
  created_at: string;
}

const tierConfig = {
  starter: { icon: Star, color: 'bg-gray-100 text-gray-700', label: 'Starter' },
  professional: { icon: Crown, color: 'bg-blue-100 text-blue-700', label: 'Professional' },
  growth: { icon: Zap, color: 'bg-purple-100 text-purple-700', label: 'Growth' }
};

const defaultFeatures = [
  { name: 'max_clients', label: 'Max Clients', description: 'Maximum number of client practices' },
  { name: 'max_claims_per_month', label: 'Max Claims/Month', description: 'Monthly claim processing limit' },
  { name: 'max_users', label: 'Max Users', description: 'Maximum team members' },
  { name: 'credentialing_applications', label: 'Credentialing Apps', description: 'Provider credentialing applications' },
  { name: 'file_storage_gb', label: 'File Storage (GB)', description: 'Document storage capacity' },
  { name: 'advanced_reports', label: 'Advanced Reports', description: 'Premium reporting features' },
  { name: 'api_access', label: 'API Access', description: 'Third-party integrations' },
  { name: 'priority_support', label: 'Priority Support', description: 'Enhanced customer support' }
];

const AdminSubscriptionManager = () => {
  const [features, setFeatures] = useState<SubscriptionFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState({ name: '', label: '', description: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_features')
        .select('*')
        .order('tier', { ascending: true })
        .order('feature_name', { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription features',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFeatureLimit = async (id: string, newLimit: number | null) => {
    try {
      const { error } = await supabase
        .from('subscription_features')
        .update({ feature_limit: newLimit })
        .eq('id', id);

      if (error) throw error;

      setFeatures(prev => prev.map(f => 
        f.id === id ? { ...f, feature_limit: newLimit } : f
      ));

      toast({
        title: 'Updated',
        description: 'Feature limit updated successfully'
      });
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feature limit',
        variant: 'destructive'
      });
    }
  };

  const toggleFeature = async (tier: 'starter' | 'professional' | 'growth', featureName: string, enabled: boolean) => {
    try {
      if (enabled) {
        // Add feature with default limit
        const defaultLimits = {
          starter: { max_clients: 5, max_claims_per_month: 100, max_users: 1, credentialing_applications: 2, file_storage_gb: 1 },
          professional: { max_clients: 25, max_claims_per_month: 1000, max_users: 5, credentialing_applications: 10, file_storage_gb: 10 },
          growth: { max_clients: null, max_claims_per_month: null, max_users: 25, credentialing_applications: null, file_storage_gb: 100 }
        };

        const defaultLimit = defaultLimits[tier]?.[featureName as keyof typeof defaultLimits.starter] || 1;

        const { error } = await supabase
          .from('subscription_features')
          .insert({
            tier: tier,
            feature_name: featureName,
            feature_limit: defaultLimit
          });

        if (error) throw error;
      } else {
        // Remove feature
        const { error } = await supabase
          .from('subscription_features')
          .delete()
          .eq('tier', tier)
          .eq('feature_name', featureName);

        if (error) throw error;
      }

      await fetchFeatures();
      toast({
        title: enabled ? 'Feature Enabled' : 'Feature Disabled',
        description: `${featureName} has been ${enabled ? 'enabled' : 'disabled'} for ${tier}`
      });
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast({
        title: 'Error',
        description: 'Failed to update feature',
        variant: 'destructive'
      });
    }
  };

  const addNewFeature = async () => {
    if (!newFeature.name) return;

    try {
      setSaving(true);
      
      // Add feature to all tiers with default limits
      const featuresToAdd = [
        { tier: 'starter' as const, feature_name: newFeature.name, feature_limit: 1 },
        { tier: 'professional' as const, feature_name: newFeature.name, feature_limit: 10 },
        { tier: 'growth' as const, feature_name: newFeature.name, feature_limit: null }
      ];

      const { error } = await supabase
        .from('subscription_features')
        .insert(featuresToAdd);

      if (error) throw error;

      setNewFeature({ name: '', label: '', description: '' });
      await fetchFeatures();
      
      toast({
        title: 'Feature Added',
        description: `${newFeature.name} has been added to all subscription tiers`
      });
    } catch (error) {
      console.error('Error adding feature:', error);
      toast({
        title: 'Error',
        description: 'Failed to add new feature',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const getFeatureForTier = (tier: string, featureName: string) => {
    return features.find(f => f.tier === tier && f.feature_name === featureName);
  };

  const renderTierCard = (tier: 'starter' | 'professional' | 'growth') => {
    const config = tierConfig[tier];
    const Icon = config.icon;

    return (
      <Card key={tier}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {config.label}
          </CardTitle>
          <CardDescription>
            Manage features for {config.label} subscription tier
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {defaultFeatures.map((feature) => {
            const existingFeature = getFeatureForTier(tier, feature.name);
            const isEnabled = !!existingFeature;

            return (
              <div key={feature.name} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${tier}-${feature.name}`} className="font-medium">
                      {feature.label}
                    </Label>
                    <Switch
                      id={`${tier}-${feature.name}`}
                      checked={isEnabled}
                      onCheckedChange={(checked) => toggleFeature(tier, feature.name, checked)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                  {isEnabled && (
                    <div className="flex items-center gap-2 mt-2">
                      <Label className="text-xs">Limit:</Label>
                      <Input
                        type="number"
                        value={existingFeature?.feature_limit || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const limit = value === '' ? null : parseInt(value);
                          updateFeatureLimit(existingFeature!.id, limit);
                        }}
                        placeholder="Unlimited"
                        className="w-24 h-7 text-xs"
                      />
                      <span className="text-xs text-muted-foreground">
                        (empty = unlimited)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading subscription features...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-muted-foreground">
            Configure features and limits for each subscription tier
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Admin Panel
        </Badge>
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList>
          <TabsTrigger value="features">Manage Features</TabsTrigger>
          <TabsTrigger value="add">Add New Feature</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <div className="grid gap-6 lg:grid-cols-3">
            {renderTierCard('starter')}
            {renderTierCard('professional')}
            {renderTierCard('growth')}
          </div>
        </TabsContent>

        <TabsContent value="add">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Add New Feature</CardTitle>
              <CardDescription>
                Create a new feature that will be available across all subscription tiers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feature-name">Feature Name</Label>
                <Input
                  id="feature-name"
                  value={newFeature.name}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., custom_reports"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature-label">Display Label</Label>
                <Input
                  id="feature-label"
                  value={newFeature.label}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Custom Reports"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feature-description">Description</Label>
                <Input
                  id="feature-description"
                  value={newFeature.description}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Create and export custom reports"
                />
              </div>
              <Button 
                onClick={addNewFeature} 
                disabled={!newFeature.name || saving}
                className="w-full"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSubscriptionManager;