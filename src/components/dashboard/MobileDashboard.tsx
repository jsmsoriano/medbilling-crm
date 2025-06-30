
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  CheckCircle,
  ArrowRight,
  Clock,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileDashboard = () => {
  const metrics = [
    {
      title: 'Monthly Revenue',
      value: '$124,500',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-blue-600'
    },
    {
      title: 'Active Clients',
      value: '247',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Claims Processed',
      value: '1,834',
      change: '+15.3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-purple-600'
    },
    {
      title: 'Pending Tasks',
      value: '23',
      change: '-5.2%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600'
    }
  ];

  const quickActions = [
    { title: 'Generate Report', icon: FileText, href: '/reports', color: 'bg-blue-500' },
    { title: 'View Clients', icon: Users, href: '/clients', color: 'bg-green-500' },
    { title: 'Check Pipeline', icon: TrendingUp, href: '/pipeline', color: 'bg-purple-500' },
    { title: 'Data Import', icon: DollarSign, href: '/data-management', color: 'bg-orange-500' }
  ];

  const recentActivity = [
    { title: 'New client Metro Medical added', time: '2 hours ago', type: 'client' },
    { title: 'Report generated for Q4', time: '4 hours ago', type: 'report' },
    { title: 'Claims batch processed', time: '6 hours ago', type: 'claims' },
    { title: 'Pipeline updated', time: '1 day ago', type: 'pipeline' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Your billing overview</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
              <Badge variant="outline" className="text-xs">
                {metric.change}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">{metric.title}</p>
              <p className="text-lg font-bold text-gray-900">{metric.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              asChild
              variant="outline"
              className="h-16 flex-col space-y-1 text-xs"
            >
              <Link to={action.href}>
                <div className={`p-2 rounded-full ${action.color} text-white mb-1`}>
                  <action.icon className="h-4 w-4" />
                </div>
                {action.title}
              </Link>
            </Button>
          ))}
        </div>
      </Card>

      {/* Performance Overview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/reports">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Collection Rate</span>
            <span className="text-sm font-semibold text-green-600">94.2%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">First Pass Rate</span>
            <span className="text-sm font-semibold text-blue-600">87.3%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Days in AR</span>
            <span className="text-sm font-semibold text-orange-600">28.5</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Denial Rate</span>
            <span className="text-sm font-semibold text-red-600">5.8%</span>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{activity.title}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default MobileDashboard;
