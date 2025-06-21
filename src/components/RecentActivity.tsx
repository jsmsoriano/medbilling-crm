
import { Card } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  FileText,
  AlertTriangle
} from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'claim_approved',
      title: 'Claim #12845 Approved',
      description: 'Blue Cross Blue Shield - $2,450',
      time: '2 hours ago',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'payment_received',
      title: 'Payment Received',
      description: 'Aetna - $5,230 for 3 claims',
      time: '4 hours ago',
      icon: DollarSign,
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      type: 'claim_denied',
      title: 'Claim #12832 Denied',
      description: 'Medicare - Missing documentation',
      time: '6 hours ago',
      icon: XCircle,
      iconColor: 'text-red-600'
    },
    {
      id: 4,
      type: 'claim_pending',
      title: 'New Claims Submitted',
      description: '15 claims sent to Humana',
      time: '8 hours ago',
      icon: FileText,
      iconColor: 'text-blue-600'
    },
    {
      id: 5,
      type: 'follow_up',
      title: 'Follow-up Required',
      description: 'Claim #12801 - Additional info requested',
      time: '1 day ago',
      icon: AlertTriangle,
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <p className="text-sm text-gray-600">Latest updates and notifications</p>
      </div>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`p-2 rounded-full bg-gray-50 ${activity.iconColor}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
