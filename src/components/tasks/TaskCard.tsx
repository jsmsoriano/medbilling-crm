import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  User,
  Eye,
  FileText,
  PauseCircle
} from 'lucide-react';

const TASK_TYPES = [
  { value: 'follow_up', label: 'Follow-Up' },
  { value: 'denial_appeal', label: 'Denial Appeal' },
  { value: 'payment_posting', label: 'Payment Posting' },
  { value: 'credentialing', label: 'Credentialing' },
  { value: 'admin', label: 'Admin' },
  { value: 'client_communication', label: 'Client Communication' },
  { value: 'billing_inquiry', label: 'Billing Inquiry' }
];

interface Task {
  id: string;
  title: string;
  description: string | null;
  task_type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'on_hold';
  due_date: string | null;
  assigned_to: string | null;
  clients?: { name: string };
  claims?: { claim_number: string; status: string };
}

interface TaskCardProps {
  task: Task;
  onViewDetails: (taskId: string) => void;
  onStatusChange: (taskId: string, status: string) => void;
}

const TaskCard = ({ task, onViewDetails, onStatusChange }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-destructive-light text-destructive border-destructive/20';
      case 'high': return 'bg-warning-light text-warning border-warning/20';
      case 'medium': return 'bg-status-pending/10 text-status-pending border-status-pending/20';
      case 'low': return 'bg-success-light text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success-light text-success border-success/20';
      case 'in_progress': return 'bg-primary-light text-primary border-primary/20';
      case 'open': return 'bg-muted text-muted-foreground border-border';
      case 'on_hold': return 'bg-warning-light text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground border-border';
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

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.01] group">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
              <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">{task.title}</h3>
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
              <p className="text-muted-foreground mb-3 text-sm line-clamp-2">{task.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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
          
          <div className="flex flex-col sm:flex-row gap-2 lg:flex-col xl:flex-row">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(task.id)}
              className="w-full sm:w-auto"
            >
              <Eye className="w-4 h-4 mr-1" />
              Details
            </Button>
            
            {task.status !== 'completed' && (
              <Select
                value={task.status}
                onValueChange={(value) => onStatusChange(task.id, value)}
              >
                <SelectTrigger className="w-full sm:w-32">
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
  );
};

export default TaskCard;