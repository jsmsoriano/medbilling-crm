
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare, 
  Users, 
  FileText, 
  Clock,
  Plus,
  User
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'demo' | 'proposal';
  subject: string;
  description: string;
  date: string;
  duration?: number;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdBy: string;
}

interface ProspectActivityTrackerProps {
  prospectId: number;
  prospectName: string;
}

const ProspectActivityTracker = ({ prospectId, prospectName }: ProspectActivityTrackerProps) => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    type: 'call',
    date: new Date().toISOString().split('T')[0],
    followUpRequired: false,
    createdBy: 'Current User'
  });

  // Mock data for demonstration
  useEffect(() => {
    setActivities([
      {
        id: '1',
        type: 'call',
        subject: 'Initial Discovery Call',
        description: 'Discussed current billing challenges and pain points. Practice has 3 providers and processes about 500 claims per month.',
        date: '2024-01-10',
        duration: 30,
        outcome: 'Positive - interested in our services',
        followUpRequired: true,
        followUpDate: '2024-01-15',
        createdBy: 'John Smith'
      },
      {
        id: '2',
        type: 'email',
        subject: 'Sent pricing proposal',
        description: 'Emailed comprehensive pricing proposal including setup fees and monthly billing rates.',
        date: '2024-01-11',
        outcome: 'Awaiting response',
        followUpRequired: true,
        followUpDate: '2024-01-16',
        createdBy: 'John Smith'
      },
      {
        id: '3',
        type: 'meeting',
        subject: 'Demo scheduled',
        description: 'Scheduled demo for next week with practice manager and lead physician.',
        date: '2024-01-12',
        duration: 15,
        outcome: 'Demo scheduled for Jan 18th',
        followUpRequired: false,
        createdBy: 'John Smith'
      }
    ]);
  }, []);

  const activityTypes = [
    { value: 'call', label: 'Phone Call', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'meeting', label: 'Meeting', icon: Users },
    { value: 'note', label: 'Note', icon: FileText },
    { value: 'task', label: 'Task', icon: Clock },
    { value: 'demo', label: 'Demo', icon: MessageSquare },
    { value: 'proposal', label: 'Proposal', icon: FileText }
  ];

  const handleAddActivity = () => {
    if (!newActivity.subject || !newActivity.description) {
      toast({
        title: "Missing information",
        description: "Please fill in subject and description",
        variant: "destructive",
      });
      return;
    }

    const activity: Activity = {
      id: Date.now().toString(),
      type: newActivity.type as Activity['type'],
      subject: newActivity.subject,
      description: newActivity.description,
      date: newActivity.date || new Date().toISOString().split('T')[0],
      duration: newActivity.duration,
      outcome: newActivity.outcome,
      followUpRequired: newActivity.followUpRequired || false,
      followUpDate: newActivity.followUpDate,
      createdBy: newActivity.createdBy || 'Current User'
    };

    setActivities(prev => [activity, ...prev]);
    setNewActivity({
      type: 'call',
      date: new Date().toISOString().split('T')[0],
      followUpRequired: false,
      createdBy: 'Current User'
    });
    setIsAddingActivity(false);

    toast({
      title: "Activity added",
      description: "New activity has been recorded successfully",
    });
  };

  const getActivityIcon = (type: Activity['type']) => {
    const activityType = activityTypes.find(t => t.value === type);
    const IconComponent = activityType?.icon || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const getActivityColor = (type: Activity['type']) => {
    const colors = {
      call: 'bg-blue-100 text-blue-800',
      email: 'bg-green-100 text-green-800',
      meeting: 'bg-purple-100 text-purple-800',
      note: 'bg-gray-100 text-gray-800',
      task: 'bg-orange-100 text-orange-800',
      demo: 'bg-indigo-100 text-indigo-800',
      proposal: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity History - {prospectName}
          </CardTitle>
          <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Activity</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Activity Type</Label>
                    <Select
                      value={newActivity.type}
                      onValueChange={(value) => setNewActivity(prev => ({ ...prev, type: value as Activity['type'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newActivity.subject || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of the activity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newActivity.description || ''}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed notes about this activity"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newActivity.duration || ''}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outcome">Outcome</Label>
                    <Input
                      id="outcome"
                      value={newActivity.outcome || ''}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, outcome: e.target.value }))}
                      placeholder="Result or outcome"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="followUpRequired"
                      checked={newActivity.followUpRequired}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                    />
                    <Label htmlFor="followUpRequired">Follow-up required</Label>
                  </div>

                  {newActivity.followUpRequired && (
                    <div className="space-y-2">
                      <Label htmlFor="followUpDate">Follow-up Date</Label>
                      <Input
                        id="followUpDate"
                        type="date"
                        value={newActivity.followUpDate || ''}
                        onChange={(e) => setNewActivity(prev => ({ ...prev, followUpDate: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddingActivity(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddActivity}>
                    Add Activity
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getActivityColor(activity.type)}>
                    <div className="flex items-center gap-1">
                      {getActivityIcon(activity.type)}
                      {activityTypes.find(t => t.value === activity.type)?.label}
                    </div>
                  </Badge>
                  <div>
                    <h4 className="font-medium">{activity.subject}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      {activity.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.duration}min
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {activity.createdBy}
                      </span>
                    </div>
                  </div>
                </div>
                {activity.followUpRequired && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Follow-up: {activity.followUpDate ? new Date(activity.followUpDate).toLocaleDateString() : 'TBD'}
                  </Badge>
                )}
              </div>

              <p className="text-gray-700">{activity.description}</p>

              {activity.outcome && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-sm"><strong>Outcome:</strong> {activity.outcome}</p>
                </div>
              )}
            </div>
          ))}

          {activities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No activities recorded yet. Add your first activity to start tracking touchpoints.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProspectActivityTracker;
