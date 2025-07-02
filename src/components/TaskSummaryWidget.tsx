import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format, isWithinInterval, subDays } from 'date-fns';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface TaskSummary {
  total: number;
  open: number;
  in_progress: number;
  completed: number;
  overdue: number;
  due_soon: number;
  urgent: number;
}

const TaskSummaryWidget = () => {
  const navigate = useNavigate();

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('status, priority, due_date, created_at')
        .neq('status', 'completed');
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate task statistics
  const taskSummary: TaskSummary = {
    total: tasks.length,
    open: tasks.filter(t => t.status === 'open').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.due_date && new Date(t.due_date) < new Date()).length,
    due_soon: tasks.filter(t => 
      t.due_date && 
      isWithinInterval(new Date(t.due_date), {
        start: new Date(),
        end: subDays(new Date(), -2) // Next 2 days
      })
    ).length,
    urgent: tasks.filter(t => t.priority === 'urgent').length
  };

  const getStatusColor = (status: string, count: number) => {
    if (count === 0) return 'text-gray-400';
    
    switch (status) {
      case 'overdue': return 'text-red-600';
      case 'due_soon': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      case 'in_progress': return 'text-blue-600';
      case 'open': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      case 'due_soon': return <Calendar className="w-4 h-4" />;
      case 'urgent': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'open': return <CheckCircle2 className="w-4 h-4" />;
      default: return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Task Summary</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/tasks')}
          className="h-8 px-2"
        >
          View All
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{taskSummary.total}</div>
              <p className="text-xs text-gray-500">Total Active</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{taskSummary.in_progress}</div>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{taskSummary.open}</div>
              <p className="text-xs text-gray-500">Open</p>
            </div>
          </div>

          {/* Priority Alerts */}
          <div className="space-y-2">
            {taskSummary.overdue > 0 && (
              <div className={`flex items-center justify-between p-2 rounded-md bg-red-50 border border-red-200`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon('overdue')}
                  <span className="text-sm font-medium text-red-800">Overdue Tasks</span>
                </div>
                <Badge variant="destructive">{taskSummary.overdue}</Badge>
              </div>
            )}

            {taskSummary.due_soon > 0 && (
              <div className={`flex items-center justify-between p-2 rounded-md bg-orange-50 border border-orange-200`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon('due_soon')}
                  <span className="text-sm font-medium text-orange-800">Due Soon (2 days)</span>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                  {taskSummary.due_soon}
                </Badge>
              </div>
            )}

            {taskSummary.urgent > 0 && (
              <div className={`flex items-center justify-between p-2 rounded-md bg-red-50 border border-red-200`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon('urgent')}
                  <span className="text-sm font-medium text-red-800">Urgent Priority</span>
                </div>
                <Badge variant="destructive">{taskSummary.urgent}</Badge>
              </div>
            )}

            {taskSummary.overdue === 0 && taskSummary.due_soon === 0 && taskSummary.urgent === 0 && (
              <div className="flex items-center justify-center p-4 text-sm text-gray-500 bg-gray-50 rounded-md">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                All tasks are on track
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => navigate('/tasks')}
              className="flex-1"
            >
              Manage Tasks
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummaryWidget;