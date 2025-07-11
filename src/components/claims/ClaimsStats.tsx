import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ClaimsStatsData {
  totalClaims: number;
  totalAR: number;
  submittedClaims: number;
  paidClaims: number;
  deniedClaims: number;
  aging0to30: number;
  aging31to60: number;
  aging61to90: number;
  aging90plus: number;
}

const ClaimsStats = () => {
  const [stats, setStats] = useState<ClaimsStatsData>({
    totalClaims: 0,
    totalAR: 0,
    submittedClaims: 0,
    paidClaims: 0,
    deniedClaims: 0,
    aging0to30: 0,
    aging31to60: 0,
    aging61to90: 0,
    aging90plus: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: claims, error } = await supabase
        .from('claims')
        .select('*');

      if (error) throw error;

      const totalClaims = claims?.length || 0;
      const totalAR = claims?.reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;
      const submittedClaims = claims?.filter(c => c.status === 'submitted').length || 0;
      const paidClaims = claims?.filter(c => c.status === 'paid').length || 0;
      const deniedClaims = claims?.filter(c => c.status === 'denied').length || 0;
      
      const aging0to30 = claims?.filter(c => c.aging_bucket === '0-30').reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;
      const aging31to60 = claims?.filter(c => c.aging_bucket === '31-60').reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;
      const aging61to90 = claims?.filter(c => c.aging_bucket === '61-90').reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;
      const aging90plus = claims?.filter(c => c.aging_bucket === '90+').reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;

      setStats({
        totalClaims,
        totalAR,
        submittedClaims,
        paidClaims,
        deniedClaims,
        aging0to30,
        aging31to60,
        aging61to90,
        aging90plus,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total AR',
      value: `$${stats.totalAR.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-primary',
    },
    {
      title: 'Total Claims',
      value: stats.totalClaims.toString(),
      icon: FileText,
      color: 'text-info',
    },
    {
      title: 'Submitted',
      value: stats.submittedClaims.toString(),
      icon: Clock,
      color: 'text-status-pending',
    },
    {
      title: 'Paid',
      value: stats.paidClaims.toString(),
      icon: CheckCircle,
      color: 'text-success',
    },
    {
      title: 'Denied',
      value: stats.deniedClaims.toString(),
      icon: AlertTriangle,
      color: 'text-destructive',
    },
  ];

  const agingCards = [
    { title: '0-30 Days', value: `$${stats.aging0to30.toLocaleString()}` },
    { title: '31-60 Days', value: `$${stats.aging31to60.toLocaleString()}` },
    { title: '61-90 Days', value: `$${stats.aging61to90.toLocaleString()}` },
    { title: '90+ Days', value: `$${stats.aging90plus.toLocaleString()}` },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 sm:p-6">
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-foreground truncate">{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color} flex-shrink-0`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AR Aging */}
      <Card>
        <CardHeader>
          <CardTitle>AR Aging Buckets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agingCards.map((aging, index) => (
              <div key={index} className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <p className="text-sm font-medium text-muted-foreground">{aging.title}</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">{aging.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsStats;