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

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
              onClick={() => onViewDetails(task.id)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Details
            </Button>
            
            {task.status !== 'completed' && (
              <Select
                value={task.status}
                onValueChange={(value) => onStatusChange(task.id, value)}
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
  );
};

export default TaskCard;