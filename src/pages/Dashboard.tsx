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
    <div className="w-full max-w-7xl mx-auto padding-page-responsive space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your medical billing performance and key metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$358,420</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </div>
          </CardContent>
        </Card>

        {/* Collection Rate */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collection Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        {/* Claims Processed */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Claims Processed</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.3% from last month
            </div>
          </CardContent>
        </Card>

        {/* Denial Rate */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Denial Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.8%</div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -1.2% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Outstanding A/R</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">$89,340</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>0-30 days</span>
                <span className="font-medium">$35,420</span>
              </div>
              <Progress value={65} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>31-60 days</span>
                <span className="font-medium">$28,910</span>
              </div>
              <Progress value={45} className="h-2" />
              <div className="flex justify-between text-sm">
                <span>61+ days</span>
                <span className="font-medium">$25,010</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Claims Approved</span>
                </div>
                <span className="font-semibold">47</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Claims Pending</span>
                </div>
                <span className="font-semibold">23</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Claims Denied</span>
                </div>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Payments Posted</span>
                </div>
                <span className="font-semibold">$12,450</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Performance Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Monthly Collection Goal</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Claims Processing Target</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Denial Rate Target</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Collections Trend</CardTitle>
            <CardDescription>Monthly revenue vs collections over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1"
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                />
                <Area 
                  type="monotone" 
                  dataKey="collections" 
                  stackId="2"
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success))" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Claims Status */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Claims Status</CardTitle>
            <CardDescription>Claims submitted, approved, and denied by day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={claimsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="submitted" fill="hsl(var(--muted-foreground))" />
                <Bar dataKey="approved" fill="hsl(var(--success))" />
                <Bar dataKey="denied" fill="hsl(var(--destructive))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* A/R Aging Chart */}
        <Card>
          <CardHeader>
            <CardTitle>A/R Aging Distribution</CardTitle>
            <CardDescription>Outstanding receivables by aging bucket</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={agingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {agingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {agingData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-muted ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;