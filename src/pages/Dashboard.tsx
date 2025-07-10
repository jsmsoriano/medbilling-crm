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
      <header className="border-b border-border bg-background px-4 sm:px-6 py-4 sm:py-5 flex-shrink-0">
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground text-left">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back, Admin User • Your Business
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Alerts</span>
            </Button>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Settings</span>
            </Button>
            <Button size="sm" className="text-xs sm:text-sm">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
        <div className="space-y-4 sm:space-y-6 max-w-full">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Revenue */}
            <Card className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Revenue</span>
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-2xl font-bold truncate">$485,360</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+12.5% from last month</span>
                </div>
              </div>
            </Card>

            {/* Active Clients */}
            <Card className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Active Clients</span>
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-2xl font-bold">24</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+3 new this month</span>
                </div>
              </div>
            </Card>

            {/* Projects */}
            <Card className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Projects</span>
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-2xl font-bold">1847</div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">+8.2% from last month</span>
                </div>
              </div>
            </Card>

            {/* Pending Tasks */}
            <Card className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Pending Tasks</span>
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="space-y-1">
                <div className="text-lg sm:text-2xl font-bold">23</div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">-2.1% from last week</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Revenue Trend Chart */}
            <Card className="lg:col-span-2 p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold">Revenue Trend</h3>
              </div>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} 
                      labelStyle={{ fontSize: '12px' }}
                      contentStyle={{ fontSize: '12px' }}
                    />
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
            <Card className="p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold">Quick Actions</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Button className="w-full justify-start h-auto p-2 sm:p-3 text-xs sm:text-sm" variant="outline">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-blue-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <span className="truncate">Add New Client</span>
                </Button>
                
                <Button className="w-full justify-start h-auto p-2 sm:p-3 text-xs sm:text-sm" variant="outline">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-green-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  </div>
                  <span className="truncate">Generate Report</span>
                </Button>
                
                <Button className="w-full justify-start h-auto p-2 sm:p-3 text-xs sm:text-sm" variant="outline">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-purple-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                  </div>
                  <span className="truncate">Schedule Meeting</span>
                </Button>
                
                <Button className="w-full justify-start h-auto p-2 sm:p-3 text-xs sm:text-sm" variant="outline">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded bg-orange-100 flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                  </div>
                  <span className="truncate">View Analytics</span>
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" title="Downtown Medical Center">Downtown Medical Center</p>
                        <p className="text-xs text-muted-foreground">Claim batch submitted</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold whitespace-nowrap">$12,450.00</p>
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" title="Riverside Family Practice">Riverside Family Practice</p>
                        <p className="text-xs text-muted-foreground">Payment received</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold whitespace-nowrap">$8,900.50</p>
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
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate" title="Metro Cardiology">Metro Cardiology</p>
                        <p className="text-xs text-muted-foreground">Claim batch rejected</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold whitespace-nowrap">$5,670.00</p>
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
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">CLM-2024-001234</p>
                    <p className="text-xs text-muted-foreground truncate">Riverside Family Practice</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-semibold whitespace-nowrap">$450</p>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-700">PAID</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">CLM-2024-001235</p>
                    <p className="text-xs text-muted-foreground truncate">Downtown Medical Center</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-semibold whitespace-nowrap">$275</p>
                    <Badge variant="secondary" className="text-xs">PENDING</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">CLM-2024-001236</p>
                    <p className="text-xs text-muted-foreground truncate">Westside Pediatrics</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-semibold whitespace-nowrap">$650</p>
                    <Badge variant="default" className="text-xs bg-green-100 text-green-700">PAID</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">CLM-2024-001237</p>
                    <p className="text-xs text-muted-foreground truncate">Sunrise Orthopedics</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-sm font-semibold whitespace-nowrap">$185</p>
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