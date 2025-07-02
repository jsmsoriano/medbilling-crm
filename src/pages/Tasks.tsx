import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import TaskDetailDialog from '@/components/TaskDetailDialog';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User,
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  PauseCircle
} from 'lucide-react';

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
  is_recurring: boolean | null;
  recurrence_pattern: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  completed_by: string | null;
  clients?: { name: string };
  claims?: { claim_number: string; status: string };
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string | null;
  is_active: boolean | null;
}

interface Claim {
  id: string;
  claim_number: string;
  status: string;
  patient_name: string;
}

const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-Up' },
  { value: 'denial_appeal', label: 'Denial Appeal' },
  { value: 'payment_posting', label: 'Payment Posting' },
  { value: 'credentialing', label: 'Credentialing' },
  { value: 'admin', label: 'Admin' },
  { value: 'client_communication', label: 'Client Communication' },
  { value: 'billing_inquiry', label: 'Billing Inquiry' }
];

const Tasks = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterTaskType, setFilterTaskType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    task_type: 'follow_up',
    client_id: '',
    related_claim_id: '',
    assigned_to: '',
    priority: 'medium' as const,
    due_date: undefined as Date | undefined,
    is_recurring: false,
    recurrence_pattern: '',
    created_by: 'Current User' // Replace with actual user
  });

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

  // Fetch clients for task assignment
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

  // Fetch claims for task assignment
  const { data: claims = [] } = useQuery({
    queryKey: ['claims'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('claims')
        .select('id, claim_number, status, patient_name')
        .in('status', ['submitted', 'denied', 'partially_paid'])
        .order('submission_date', { ascending: false });
      
      if (error) throw error;
      return data as Claim[];
    }
  });

  // Fetch team members
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team_members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as TeamMember[];
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
      setNewTask({
        title: '',
        description: '',
        task_type: 'follow_up',
        client_id: '',
        related_claim_id: '',
        assigned_to: '',
        priority: 'medium',
        due_date: undefined,
        is_recurring: false,
        recurrence_pattern: '',
        created_by: 'Current User'
      });
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    },
    onError: (error) => {
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
        updateData.completed_by = 'Current User'; // Replace with actual user info
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

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    if (!newTask.client_id) {
      toast({
        title: "Error",
        description: "Client selection is required",
        variant: "destructive",
      });
      return;
    }
    createTaskMutation.mutate(newTask);
  };

  const handleViewDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailDialogOpen(true);
  };

  const exportTasks = () => {
    const csv = [
      ['Title', 'Type', 'Status', 'Priority', 'Client', 'Assigned To', 'Due Date', 'Created', 'Description'],
      ...filteredTasks.map(task => [
        task.title,
        TASK_TYPES.find(t => t.value === task.task_type)?.label || task.task_type,
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'on_hold': return <PauseCircle className="w-4 h-4" />;
      case 'open': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Task Type</Label>
                    <Select value={newTask.task_type} onValueChange={(value) => setNewTask({ ...newTask, task_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TASK_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Client *</Label>
                    <Select value={newTask.client_id} onValueChange={(value) => setNewTask({ ...newTask, client_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Related Claim (Optional)</Label>
                    <Select value={newTask.related_claim_id} onValueChange={(value) => setNewTask({ ...newTask, related_claim_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select claim" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No claim</SelectItem>
                        {claims.map((claim) => (
                          <SelectItem key={claim.id} value={claim.id}>
                            {claim.claim_number} - {claim.patient_name} ({claim.status})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assign To</Label>
                    <Select value={newTask.assigned_to} onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to team member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name} {member.role && `(${member.role})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.due_date ? format(newTask.due_date, 'PPP') : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTask.due_date}
                          onSelect={(date) => setNewTask({ ...newTask, due_date: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask} disabled={createTaskMutation.isPending}>
                    {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks, clients, claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterTaskType} onValueChange={setFilterTaskType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Task Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {TASK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
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
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {TASK_TYPES.find(t => t.value === task.task_type)?.label || task.task_type}
                      </Badge>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(task.status)}
                          {task.status.replace('_', ' ')}
                        </div>
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 mb-3 text-sm">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {task.clients && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {task.clients.name}
                        </div>
                      )}
                      
                      {task.claims && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {task.claims.claim_number} ({task.claims.status})
                        </div>
                      )}
                      
                      {task.assigned_to && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Assigned: {task.assigned_to}
                        </div>
                      )}
                      
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(task.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>
                    
                    {task.status !== 'completed' && (
                      <Select
                        value={task.status}
                        onValueChange={(value) => updateTaskMutation.mutate({ id: task.id, status: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Task Detail Dialog */}
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