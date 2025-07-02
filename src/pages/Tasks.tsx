import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import TaskDetailDialog from '@/components/TaskDetailDialog';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskCard from '@/components/tasks/TaskCard';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import { AlertCircle, Download } from 'lucide-react';

interface Task {
  id: string;
  client_id: string | null;
  title: string;
  description: string | null;
  task_type: string;
  related_claim_id: string | null;
  assigned_to: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'on_hold';
  due_date: string | null;
  created_at: string;
  clients?: { name: string };
  claims?: { claim_number: string; status: string };
}

const Tasks = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterTaskType, setFilterTaskType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch tasks with related data
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients(name),
          claims(claim_number, status, patient_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    }
  });

  // Fetch related data for form
  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: claims = [] } = useQuery({
    queryKey: ['claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claims')
        .select('id, claim_number, status, patient_name')
        .in('status', ['submitted', 'denied', 'partially_paid'])
        .order('submission_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          due_date: taskData.due_date ? format(taskData.due_date, 'yyyy-MM-dd') : null,
          related_claim_id: taskData.related_claim_id || null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
  });

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        updateData.completed_by = 'Current User';
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    }
  });

  const handleCreateTask = (taskData: any) => {
    if (!taskData.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    if (!taskData.client_id) {
      toast({
        title: "Error",
        description: "Client selection is required",
        variant: "destructive",
      });
      return;
    }
    createTaskMutation.mutate(taskData);
  };

  const handleViewDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailDialogOpen(true);
  };

  const handleStatusChange = (taskId: string, status: string) => {
    updateTaskMutation.mutate({ id: taskId, status });
  };

  const exportTasks = () => {
    const csv = [
      ['Title', 'Type', 'Status', 'Priority', 'Client', 'Assigned To', 'Due Date', 'Created', 'Description'],
      ...filteredTasks.map(task => [
        task.title,
        task.task_type,
        task.status.replace('_', ' '),
        task.priority,
        task.clients?.name || '',
        task.assigned_to || '',
        task.due_date ? format(new Date(task.due_date), 'yyyy-MM-dd') : '',
        format(new Date(task.created_at), 'yyyy-MM-dd'),
        task.description || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesTaskType = filterTaskType === 'all' || task.task_type === filterTaskType;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.clients?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.claims?.claim_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesTaskType && matchesSearch;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task & Follow-Up Manager</h1>
          <p className="text-gray-600 mt-2">Manage tasks, follow-ups, and team assignments with full audit trail</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTasks}>
            <Download className="w-4 h-4 mr-2" />
            Export Tasks
          </Button>
          <CreateTaskDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onCreateTask={handleCreateTask}
            clients={clients}
            claims={claims}
            teamMembers={teamMembers}
            isCreating={createTaskMutation.isPending}
          />
        </div>
      </div>

      <TaskFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        filterPriority={filterPriority}
        filterTaskType={filterTaskType}
        onSearchChange={setSearchTerm}
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
        onTaskTypeChange={setFilterTaskType}
      />

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' || filterPriority !== 'all' || filterTaskType !== 'all'
                  ? 'Try adjusting your filters or search terms.' 
                  : 'Create your first task to get started.'}
              </p>
            </div>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onViewDetails={handleViewDetails}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>

      <TaskDetailDialog
        taskId={selectedTaskId}
        isOpen={isDetailDialogOpen}
        onClose={() => {
          setIsDetailDialogOpen(false);
          setSelectedTaskId(null);
        }}
      />
    </div>
  );
};

export default Tasks;