import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ARData {
  totalAR: number;
  aging0to30: number;
  aging31to60: number;
  aging61to90: number;
  aging90plus: number;
  claimsByStatus: {
    submitted: number;
    partially_paid: number;
    paid: number;
    denied: number;
  };
}

const AROverviewWidgets = () => {
  const [arData, setArData] = useState<ARData>({
    totalAR: 0,
    aging0to30: 0,
    aging31to60: 0,
    aging61to90: 0,
    aging90plus: 0,
    claimsByStatus: {
      submitted: 0,
      partially_paid: 0,
      paid: 0,
      denied: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchARData();
  }, []);

  const fetchARData = async () => {
    try {
      const { data: claims, error } = await supabase
        .from('claims')
        .select('*');

      if (error) throw error;

      const totalAR = claims?.reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;
      const aging0to30 = claims?.filter(c => c.aging_bucket === '0-30').reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;
      const aging31to60 = claims?.filter(c => c.aging_bucket === '31-60').reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;
      const aging61to90 = claims?.filter(c => c.aging_bucket === '61-90').reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;
      const aging90plus = claims?.filter(c => c.aging_bucket === '90+').reduce((sum, claim) => sum + (claim.balance_due || 0), 0) || 0;

      const claimsByStatus = {
        submitted: claims?.filter(c => c.status === 'submitted').length || 0,
        partially_paid: claims?.filter(c => c.status === 'partially_paid').length || 0,
        paid: claims?.filter(c => c.status === 'paid').length || 0,
        denied: claims?.filter(c => c.status === 'denied').length || 0,
      };

      setArData({
        totalAR,
        aging0to30,
        aging31to60,
        aging61to90,
        aging90plus,
        claimsByStatus,
      });
    } catch (error) {
      console.error('Error fetching AR data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const agingPercentages = {
    aging0to30: arData.totalAR > 0 ? (arData.aging0to30 / arData.totalAR) * 100 : 0,
    aging31to60: arData.totalAR > 0 ? (arData.aging31to60 / arData.totalAR) * 100 : 0,
    aging61to90: arData.totalAR > 0 ? (arData.aging61to90 / arData.totalAR) * 100 : 0,
    aging90plus: arData.totalAR > 0 ? (arData.aging90plus / arData.totalAR) * 100 : 0,
  };

  return (
    <div className="space-y-6">
      {/* Main AR Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total AR</p>
                <p className="text-3xl font-bold text-primary">${arData.totalAR.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">0-30 Days</p>
                <p className="text-2xl font-bold text-green-600">${arData.aging0to30.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{agingPercentages.aging0to30.toFixed(1)}% of total</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">31-90 Days</p>
                <p className="text-2xl font-bold text-yellow-600">${(arData.aging31to60 + arData.aging61to90).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{(agingPercentages.aging31to60 + agingPercentages.aging61to90).toFixed(1)}% of total</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">90+ Days</p>
                <p className="text-2xl font-bold text-red-600">${arData.aging90plus.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{agingPercentages.aging90plus.toFixed(1)}% of total</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claims by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Claims by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-2xl font-bold text-yellow-600">{arData.claimsByStatus.submitted}</p>
              <p className="text-sm font-medium text-yellow-700">Submitted</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{arData.claimsByStatus.partially_paid}</p>
              <p className="text-sm font-medium text-blue-700">Partially Paid</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-600">{arData.claimsByStatus.paid}</p>
              <p className="text-sm font-medium text-green-700">Paid</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-600">{arData.claimsByStatus.denied}</p>
              <p className="text-sm font-medium text-red-700">Denied</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AROverviewWidgets;