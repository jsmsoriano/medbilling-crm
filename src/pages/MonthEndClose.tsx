import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  AlertTriangle,
  FileText,
  Users,
  DollarSign,
  XCircle
} from 'lucide-react';
import MonthEndChecklist from '@/components/month-end/MonthEndChecklist';
import MonthEndSignOff from '@/components/month-end/MonthEndSignOff';
import ReportPackModal from '@/components/month-end/ReportPackModal';

interface MonthEndPeriod {
  id: string;
  year: number;
  month: number;
  status: 'open' | 'closed';
  close_date: string | null;
  closed_by: string | null;
}

interface ChecklistItem {
  id: string;
  item_name: string;
  description: string;
  is_completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  is_auto_checkable: boolean;
  sort_order: number;
}

const MonthEndClose = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSignOffModal, setShowSignOffModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Fetch current month-end period
  const { data: currentPeriod, isLoading: periodLoading } = useQuery({
    queryKey: ['month-end-period', currentYear, currentMonth],
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
      
      return data as MonthEndPeriod | null;
    }
  });

  // Fetch checklist items
  const { data: checklistItems = [], isLoading: checklistLoading } = useQuery({
    queryKey: ['month-end-checklist', currentPeriod?.id],
    queryFn: async () => {
      if (!currentPeriod?.id) return [];
      
      const { data, error } = await supabase
        .from('month_end_checklist_items')
        .select('*')
        .eq('period_id', currentPeriod.id)
        .order('sort_order');
      
      if (error) throw error;
      return data as ChecklistItem[];
    },
    enabled: !!currentPeriod?.id
  });

  // Fetch month statistics
  const { data: stats } = useQuery({
    queryKey: ['month-end-stats', currentYear, currentMonth],
    queryFn: async () => {
      const monthStart = new Date(currentYear, currentMonth - 1, 1);
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

  // Create period mutation
  const createPeriodMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('month_end_periods')
        .insert([{ year: currentYear, month: currentMonth }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['month-end-period'] });
      // Create standard checklist
      createChecklistMutation.mutate(data.id);
    }
  });

  // Create checklist mutation
  const createChecklistMutation = useMutation({
    mutationFn: async (periodId: string) => {
      const { error } = await supabase.rpc('create_standard_checklist', {
        period_id: periodId
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-end-checklist'] });
      toast({
        title: "Month-End Period Created",
        description: "Standard checklist has been initialized.",
      });
    }
  });

  // Close month mutation
  const closeMonthMutation = useMutation({
    mutationFn: async (signOffData: any) => {
      if (!currentPeriod?.id) throw new Error('No active period');
      
      // Create sign-off record
      const { error: signOffError } = await supabase
        .from('month_end_sign_offs')
        .insert([{
          period_id: currentPeriod.id,
          signed_by: signOffData.signedBy,
          notes: signOffData.notes
        }]);
      
      if (signOffError) throw signOffError;
      
      // Close the period
      const { error: closeError } = await supabase
        .from('month_end_periods')
        .update({
          status: 'closed',
          close_date: new Date().toISOString().split('T')[0],
          closed_by: signOffData.signedBy
        })
        .eq('id', currentPeriod.id);
      
      if (closeError) throw closeError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-end-period'] });
      setShowSignOffModal(false);
      toast({
        title: "Month Closed Successfully",
        description: "The month-end period has been closed and locked.",
      });
    }
  });

  // Auto-check items on load
  useEffect(() => {
    if (currentPeriod?.id && currentPeriod.status === 'open') {
      supabase.rpc('check_month_end_auto_items', {
        period_year: currentYear,
        period_month: currentMonth
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ['month-end-checklist'] });
      });
    }
  }, [currentPeriod?.id, currentYear, currentMonth, queryClient]);

  const completedItems = checklistItems.filter(item => item.is_completed).length;
  const progressPercentage = checklistItems.length > 0 ? Math.round((completedItems / checklistItems.length) * 100) : 0;
  
  const daysRemaining = new Date(currentYear, currentMonth, 0).getDate() - currentDate.getDate();
  const isNearDeadline = daysRemaining <= 2;
  const allItemsComplete = checklistItems.length > 0 && completedItems === checklistItems.length;

  if (periodLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Month-End Close</h1>
          <p className="text-gray-600 mt-2">
            {format(new Date(currentYear, currentMonth - 1), 'MMMM yyyy')} - Close Process
          </p>
        </div>
        
        {!currentPeriod && (
          <Button 
            onClick={() => createPeriodMutation.mutate()}
            disabled={createPeriodMutation.isPending}
          >
            {createPeriodMutation.isPending ? 'Initializing...' : 'Initialize Month-End'}
          </Button>
        )}
      </div>

      {/* Warning banner for near deadline */}
      {isNearDeadline && currentPeriod?.status === 'open' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">
                Only {daysRemaining} days remaining until month-end! 
                {!allItemsComplete && ' Please complete all checklist items.'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Month Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <Badge variant={currentPeriod?.status === 'closed' ? 'default' : 'secondary'}>
                {currentPeriod?.status === 'closed' ? 'Closed' : 'Open'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Days Remaining:</span>
              <span className={`font-medium ${isNearDeadline ? 'text-orange-600' : 'text-gray-900'}`}>
                {daysRemaining}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Progress:</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>

            {currentPeriod?.status === 'closed' && (
              <div className="pt-2 border-t space-y-2 text-sm text-gray-600">
                <div>Closed: {format(new Date(currentPeriod.close_date!), 'PPP')}</div>
                <div>By: {currentPeriod.closed_by}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Open Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.openClaims || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Claims to submit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Unresolved Denials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats?.unresolvedDenials || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Denials to resolve</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payments to Reconcile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats?.paymentsToReconcile || 0}
            </div>
            <p className="text-sm text-gray-600 mt-1">Payments pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {currentPeriod && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report Pack
              </Button>
              
              {currentPeriod.status === 'open' && allItemsComplete && (
                <Button 
                  onClick={() => setShowSignOffModal(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Close Month
                </Button>
              )}
              
              {currentPeriod.status === 'open' && !allItemsComplete && (
                <Button 
                  disabled
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Complete Checklist First
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      {currentPeriod && (
        <MonthEndChecklist 
          periodId={currentPeriod.id}
          items={checklistItems}
          isLoading={checklistLoading}
          isPeriodClosed={currentPeriod.status === 'closed'}
        />
      )}

      {/* Modals */}
      <ReportPackModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        periodId={currentPeriod?.id}
        year={currentYear}
        month={currentMonth}
      />

      <MonthEndSignOff
        isOpen={showSignOffModal}
        onClose={() => setShowSignOffModal(false)}
        onSignOff={(data) => closeMonthMutation.mutate(data)}
        isLoading={closeMonthMutation.isPending}
      />
    </div>
  );
};

export default MonthEndClose;