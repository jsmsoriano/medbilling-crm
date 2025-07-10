import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Users, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  Download
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const revenueData = [
  { name: 'Jan', revenue: 42000, collections: 38000 },
  { name: 'Feb', revenue: 45000, collections: 42000 },
  { name: 'Mar', revenue: 48000, collections: 44000 },
  { name: 'Apr', revenue: 52000, collections: 47000 },
  { name: 'May', revenue: 49000, collections: 46000 },
  { name: 'Jun', revenue: 55000, collections: 51000 },
  { name: 'Jul', revenue: 58000, collections: 54000 },
];

const claimsData = [
  { name: 'Mon', submitted: 45, approved: 38, denied: 7 },
  { name: 'Tue', submitted: 52, approved: 44, denied: 8 },
  { name: 'Wed', submitted: 48, approved: 41, denied: 7 },
  { name: 'Thu', submitted: 58, approved: 49, denied: 9 },
  { name: 'Fri', submitted: 62, approved: 55, denied: 7 },
  { name: 'Sat', submitted: 35, approved: 32, denied: 3 },
  { name: 'Sun', submitted: 28, approved: 25, denied: 3 },
];

const agingData = [
  { name: '0-30 days', value: 35, amount: 125000, color: '#22c55e' },
  { name: '31-60 days', value: 25, amount: 89000, color: '#f59e0b' },
  { name: '61-90 days', value: 20, amount: 67000, color: '#f97316' },
  { name: '90+ days', value: 20, amount: 78000, color: '#ef4444' },
];

const recentActivities = [
  { id: 1, type: 'payment', message: 'Payment of $2,450 received from Aetna', time: '2 minutes ago', icon: DollarSign, color: 'text-green-600' },
  { id: 2, type: 'claim', message: 'Claim #CLM-2024-0458 was approved', time: '15 minutes ago', icon: CheckCircle, color: 'text-green-600' },
  { id: 3, type: 'denial', message: 'Claim #CLM-2024-0441 was denied - needs review', time: '32 minutes ago', icon: AlertTriangle, color: 'text-red-600' },
  { id: 4, type: 'task', message: 'New task assigned: Follow up on pending claims', time: '1 hour ago', icon: Clock, color: 'text-blue-600' },
];

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <header className="border-b border-border bg-background px-6 py-5 flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, Admin User • Your Business
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 py-6 overflow-auto">
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">$485,360</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% from last month
                </div>
              </div>
            </Card>

            {/* Active Clients */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Active Clients</span>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">24</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3 new this month
                </div>
              </div>
            </Card>

            {/* Projects */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Projects</span>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">1847</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% from last month
                </div>
              </div>
            </Card>

            {/* Pending Tasks */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Pending Tasks</span>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">23</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -2.1% from last week
                </div>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Trend Chart */}
            <Card className="lg:col-span-2 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Revenue Trend</h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <Button className="w-full justify-start h-auto p-3" variant="outline">
                  <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center mr-3">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Add New Client</span>
                </Button>
                
                <Button className="w-full justify-start h-auto p-3" variant="outline">
                  <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center mr-3">
                    <FileText className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Generate Report</span>
                </Button>
                
                <Button className="w-full justify-start h-auto p-3" variant="outline">
                  <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center mr-3">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <span>Schedule Meeting</span>
                </Button>
                
                <Button className="w-full justify-start h-auto p-3" variant="outline">
                  <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center mr-3">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  <span>View Analytics</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">DM</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Downtown Medical Center</p>
                        <p className="text-xs text-muted-foreground">Claim batch submitted</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">$12,450.00</p>
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">RF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Riverside Family Practice</p>
                        <p className="text-xs text-muted-foreground">Payment received</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">$8,900.50</p>
                        <Badge variant="default" className="text-xs bg-green-100 text-green-700">Completed</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">MC</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">Metro Cardiology</p>
                        <p className="text-xs text-muted-foreground">Claim batch rejected</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">$5,670.00</p>
                        <Badge variant="destructive" className="text-xs">Rejected</Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">6 hours ago</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Projects */}
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Recent Projects</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">CLM-2024-001234</p>
                    <p className="text-xs text-muted-foreground">Riverside Family Practice</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">$450</p>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-700">PAID</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">CLM-2024-001235</p>
                    <p className="text-xs text-muted-foreground">Downtown Medical Center</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">$275</p>
                    <Badge variant="secondary" className="text-xs">PENDING</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">CLM-2024-001236</p>
                    <p className="text-xs text-muted-foreground">Westside Pediatrics</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">$650</p>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-700">PAID</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">CLM-2024-001237</p>
                    <p className="text-xs text-muted-foreground">Sunrise Orthopedics</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">$185</p>
                    <Badge variant="outline" className="text-xs">SUBMITTED</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;