import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  AlertTriangle,
  FileText,
  ArrowRight,
  User
} from 'lucide-react';

const MonthEndDashboardWidget = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Fetch current month-end period
  const { data: currentPeriod } = useQuery({
    queryKey: ['month-end-period-widget', currentYear, currentMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('month_end_periods')
        .select('*')
        .eq('year', currentYear)
        .eq('month', currentMonth)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    }
  });

  // Fetch checklist progress
  const { data: checklistStats } = useQuery({
    queryKey: ['month-end-checklist-stats', currentPeriod?.id],
    queryFn: async () => {
      if (!currentPeriod?.id) return null;
      
      const { data, error } = await supabase
        .from('month_end_checklist_items')
        .select('is_completed')
        .eq('period_id', currentPeriod.id);
      
      if (error) throw error;
      
      const total = data.length;
      const completed = data.filter(item => item.is_completed).length;
      
      return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    },
    enabled: !!currentPeriod?.id
  });

  // Fetch key statistics
  const { data: stats } = useQuery({
    queryKey: ['month-end-widget-stats', currentYear, currentMonth],
    queryFn: async () => {
      const monthEnd = new Date(currentYear, currentMonth, 0);
      
      // Open claims
      const { count: openClaims } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'submitted')
        .lte('service_date', format(monthEnd, 'yyyy-MM-dd'));
      
      // Unresolved denials
      const { count: unresolvedDenials } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'denied')
        .not('denial_reason', 'is', null);
      
      // Payments to reconcile
      const { count: paymentsToReconcile } = await supabase
        .from('payments')
        .select('claim_id, claims!inner(service_date)', { count: 'exact', head: true })
        .lte('claims.service_date', format(monthEnd, 'yyyy-MM-dd'))
        .is('claims.payment_amount', null);
      
      return {
        openClaims: openClaims || 0,
        unresolvedDenials: unresolvedDenials || 0,
        paymentsToReconcile: paymentsToReconcile || 0
      };
    }
  });

  // Fetch latest sign-off
  const { data: latestSignOff } = useQuery({
    queryKey: ['month-end-latest-signoff', currentPeriod?.id],
    queryFn: async () => {
      if (!currentPeriod?.id || currentPeriod.status !== 'closed') return null;
      
      const { data, error } = await supabase
        .from('month_end_sign_offs')
        .select('*')
        .eq('period_id', currentPeriod.id)
        .order('signed_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!currentPeriod?.id && currentPeriod.status === 'closed'
  });

  const daysRemaining = new Date(currentYear, currentMonth, 0).getDate() - currentDate.getDate();
  const isNearDeadline = daysRemaining <= 2;
  const allItemsComplete = checklistStats && checklistStats.completed === checklistStats.total && checklistStats.total > 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="w-5 h-5" />
          Month-End Close
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Status:</span>
          <Badge variant={currentPeriod?.status === 'closed' ? 'default' : 'secondary'}>
            {currentPeriod?.status === 'closed' ? 'Closed' : currentPeriod ? 'Open' : 'Not Started'}
          </Badge>
        </div>

        {/* Days Remaining */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Days Remaining:</span>
          <span className={`text-sm font-medium ${isNearDeadline && currentPeriod?.status === 'open' ? 'text-orange-600' : 'text-gray-900'}`}>
            {daysRemaining}
          </span>
        </div>

        {/* Progress */}
        {checklistStats && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress:</span>
              <span className="text-sm font-medium">{checklistStats.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  checklistStats.percentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${checklistStats.percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {checklistStats.completed} of {checklistStats.total} items completed
            </div>
          </div>
        )}

        {/* Key Statistics */}
        <div className="space-y-2 pt-2 border-t">
          <div className="text-sm font-medium text-gray-700">Outstanding Items:</div>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Open Claims:</span>
              <span className={`font-medium ${stats?.openClaims && stats.openClaims > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                {stats?.openClaims || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Unresolved Denials:</span>
              <span className={`font-medium ${stats?.unresolvedDenials && stats.unresolvedDenials > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stats?.unresolvedDenials || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Payments to Reconcile:</span>
              <span className={`font-medium ${stats?.paymentsToReconcile && stats.paymentsToReconcile > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                {stats?.paymentsToReconcile || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Warning for near deadline */}
        {isNearDeadline && currentPeriod?.status === 'open' && !allItemsComplete && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">
                Month-end deadline approaching!
              </span>
            </div>
          </div>
        )}

        {/* Sign-off info for closed periods */}
        {currentPeriod?.status === 'closed' && latestSignOff && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-green-800 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Month Closed</span>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {latestSignOff.signed_by}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(new Date(latestSignOff.signed_at), 'PPp')}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to="/month-end-close" className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              View Full Module
              <ArrowRight className="w-3 h-3" />
            </Link>
          </Button>
          
          {currentPeriod?.status === 'open' && allItemsComplete && (
            <div className="text-center">
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                Ready to Close Month
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthEndDashboardWidget;