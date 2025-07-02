import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-Up' },
  { value: 'denial_appeal', label: 'Denial Appeal' },
  { value: 'payment_posting', label: 'Payment Posting' },
  { value: 'credentialing', label: 'Credentialing' },
  { value: 'admin', label: 'Admin' },
  { value: 'client_communication', label: 'Client Communication' },
  { value: 'billing_inquiry', label: 'Billing Inquiry' }
];

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (taskData: any) => void;
  clients: any[];
  claims: any[];
  teamMembers: any[];
  isCreating: boolean;
}

const CreateTaskDialog = ({
  isOpen,
  onOpenChange,
  onCreateTask,
  clients,
  claims,
  teamMembers,
  isCreating
}: CreateTaskDialogProps) => {
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
    created_by: 'Current User'
  });

  const handleCreateTask = () => {
    onCreateTask(newTask);
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;