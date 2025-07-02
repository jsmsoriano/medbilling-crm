import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { 
  Calendar,
  User,
  FileText,
  Clock,
  History,
  Download
} from 'lucide-react';

interface TaskDetailDialogProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

interface TaskHistory {
  id: string;
  action_type: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  changed_by: string;
  created_at: string;
  notes: string | null;
}

interface TaskDetail {
  id: string;
  title: string;
  description: string | null;
  task_type: string;
  priority: string;
  status: string;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  clients?: { name: string };
  claims?: { claim_number: string; status: string };
}

const TaskDetailDialog = ({ taskId, isOpen, onClose }: TaskDetailDialogProps) => {
  // Fetch task details
  const { data: task } = useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      if (!taskId) return null;
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients(name),
          claims(claim_number, status)
        `)
        .eq('id', taskId)
        .single();
      
      if (error) throw error;
      return data as TaskDetail;
    },
    enabled: !!taskId
  });

  // Fetch task history
  const { data: history = [] } = useQuery({
    queryKey: ['task-history', taskId],
    queryFn: async () => {
      if (!taskId) return [];
      const { data, error } = await supabase
        .from('task_history')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as TaskHistory[];
    },
    enabled: !!taskId
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'open': return 'bg-gray-100 text-gray-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'created': return '🆕';
      case 'status_changed': return '🔄';
      case 'assigned': return '👤';
      case 'completed': return '✅';
      case 'updated': return '📝';
      default: return '📋';
    }
  };

  const exportHistory = () => {
    if (!task || !history.length) return;
    
    const csv = [
      ['Date', 'Action', 'Field', 'Old Value', 'New Value', 'Changed By', 'Notes'],
      ...history.map(h => [
        format(new Date(h.created_at), 'yyyy-MM-dd HH:mm:ss'),
        h.action_type,
        h.field_name || '',
        h.old_value || '',
        h.new_value || '',
        h.changed_by,
        h.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-${task.id}-history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Task Details: {task.title}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportHistory}
              className="ml-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Export History
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Task Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="capitalize">{task.task_type?.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <div className="mt-1">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Created By</label>
                  <p>{task.created_by}</p>
                </div>
              </div>

              {task.description && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="mt-1 text-gray-900">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {task.clients && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Client: {task.clients.name}</span>
                  </div>
                )}
                
                {task.claims && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      Claim: {task.claims.claim_number} ({task.claims.status})
                    </span>
                  </div>
                )}

                {task.assigned_to && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Assigned to: {task.assigned_to}</span>
                  </div>
                )}

                {task.due_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Task History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Task History ({history.length} entries)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No history entries found</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry, index) => (
                    <div key={entry.id}>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                          {getActionIcon(entry.action_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {entry.action_type.replace('_', ' ').toUpperCase()}
                              {entry.field_name && ` - ${entry.field_name.replace('_', ' ')}`}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {format(new Date(entry.created_at), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </div>
                          
                          {(entry.old_value || entry.new_value) && (
                            <div className="mt-1 text-sm text-gray-600">
                              {entry.old_value && (
                                <span className="line-through text-red-600">
                                  {entry.old_value}
                                </span>
                              )}
                              {entry.old_value && entry.new_value && ' → '}
                              {entry.new_value && (
                                <span className="text-green-600 font-medium">
                                  {entry.new_value}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {entry.notes && (
                            <p className="mt-1 text-sm text-gray-600">{entry.notes}</p>
                          )}
                          
                          <p className="mt-1 text-xs text-gray-500">
                            By: {entry.changed_by}
                          </p>
                        </div>
                      </div>
                      {index < history.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;