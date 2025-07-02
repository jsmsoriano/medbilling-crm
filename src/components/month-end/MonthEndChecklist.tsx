import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  CheckCircle2, 
  Clock, 
  User,
  Calendar,
  RefreshCw
} from 'lucide-react';

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

interface MonthEndChecklistProps {
  periodId: string;
  items: ChecklistItem[];
  isLoading: boolean;
  isPeriodClosed: boolean;
}

const MonthEndChecklist = ({ periodId, items, isLoading, isPeriodClosed }: MonthEndChecklistProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Update checklist item mutation
  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, isCompleted }: { itemId: string; isCompleted: boolean }) => {
      const updateData: any = { 
        is_completed: isCompleted 
      };
      
      if (isCompleted) {
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = 'Current User';
      } else {
        updateData.completed_at = null;
        updateData.completed_by = null;
      }
      
      const { error } = await supabase
        .from('month_end_checklist_items')
        .update(updateData)
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-end-checklist'] });
      toast({
        title: "Checklist Updated",
        description: "Item status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update checklist item.",
        variant: "destructive",
      });
    }
  });

  // Run auto-checks mutation
  const runAutoChecksMutation = useMutation({
    mutationFn: async () => {
      const currentDate = new Date();
      const { error } = await supabase.rpc('check_month_end_auto_items', {
        period_year: currentDate.getFullYear(),
        period_month: currentDate.getMonth() + 1
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-end-checklist'] });
      toast({
        title: "Auto-checks Complete",
        description: "Automated checklist items have been updated.",
      });
    }
  });

  const handleItemToggle = (itemId: string, currentStatus: boolean) => {
    if (isPeriodClosed) return;
    
    updateItemMutation.mutate({
      itemId,
      isCompleted: !currentStatus
    });
  };

  const completedCount = items.filter(item => item.is_completed).length;
  const progressPercentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading checklist...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Month-End Checklist
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {completedCount} of {items.length} completed ({progressPercentage}%)
            </Badge>
            {!isPeriodClosed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => runAutoChecksMutation.mutate()}
                disabled={runAutoChecksMutation.isPending}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${runAutoChecksMutation.isPending ? 'animate-spin' : ''}`} />
                Run Auto-checks
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No checklist items found. Please initialize the month-end period.
          </div>
        ) : (
          items.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 border rounded-lg transition-colors ${
                item.is_completed 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={item.is_completed}
                  onCheckedChange={() => handleItemToggle(item.id, item.is_completed)}
                  disabled={isPeriodClosed || updateItemMutation.isPending}
                  className="mt-1"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      item.is_completed ? 'text-green-800' : 'text-gray-900'
                    }`}>
                      {item.item_name}
                      {item.is_auto_checkable && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Auto-check
                        </Badge>
                      )}
                    </h4>
                    
                    {item.is_completed && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                  
                  {item.is_completed && item.completed_at && (
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(item.completed_at), 'PPp')}
                      </div>
                      {item.completed_by && (
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.completed_by}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isPeriodClosed && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800 text-sm">
              <Clock className="w-4 h-4" />
              <span className="font-medium">
                This month-end period is closed. No changes can be made to the checklist.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthEndChecklist;