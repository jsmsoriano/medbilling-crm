
import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PerformanceFilters, { PerformanceFilter } from '@/components/PerformanceFilters';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Clock,
  Target,
  Calendar,
  Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Performance = () => {
  const [filters, setFilters] = useState<PerformanceFilter>({});

  const monthlyData = [
    { month: 'Jan', revenue: 65000, claims: 234, denialRate: 8.2, arDays: 32 },
    { month: 'Feb', revenue: 71000, claims: 267, denialRate: 7.8, arDays: 30 },
    { month: 'Mar', revenue: 68000, claims: 245, denialRate: 9.1, arDays: 34 },
    { month: 'Apr', revenue: 75000, claims: 289, denialRate: 6.5, arDays: 28 },
    { month: 'May', revenue: 82000, claims: 312, denialRate: 5.9, arDays: 26 },
    { month: 'Jun', revenue: 87430, claims: 347, denialRate: 5.8, arDays: 28.5 },
  ];

  const allClientPerformance = [
    { name: 'Metro Medical', revenue: 15420, claims: 45, denialRate: 3.2, satisfaction: 98, practiceGroup: 'Primary Care' },
    { name: 'Sunrise Family', revenue: 12340, claims: 38, denialRate: 4.1, satisfaction: 95, practiceGroup: 'Family Medicine' },
    { name: 'Downtown Cardio', revenue: 9850, claims: 29, denialRate: 6.8, satisfaction: 92, practiceGroup: 'Cardiology' },
    { name: 'Pediatric Assoc', revenue: 8720, claims: 31, denialRate: 2.9, satisfaction: 99, practiceGroup: 'Pediatrics' },
    { name: 'Women\'s Health', revenue: 7680, claims: 22, denialRate: 5.5, satisfaction: 94, practiceGroup: 'OB/GYN' },
    { name: 'Valley Medical', revenue: 6540, claims: 18, denialRate: 4.3, satisfaction: 96, practiceGroup: 'Primary Care' },
    { name: 'Coastal Ortho', revenue: 5890, claims: 15, denialRate: 7.2, satisfaction: 90, practiceGroup: 'Orthopedics' },
    { name: 'Mental Health', revenue: 4320, claims: 12, denialRate: 3.8, satisfaction: 97, practiceGroup: 'Mental Health' },
  ];

  const availableClients = Array.from(new Set(allClientPerformance.map(client => client.name)));
  const availablePracticeGroups = Array.from(new Set(allClientPerformance.map(client => client.practiceGroup)));

  // Filter client performance data based on active filters
  const filteredClientPerformance = useMemo(() => {
    return allClientPerformance.filter(client => {
      if (filters.client && client.name !== filters.client) return false;
      if (filters.practiceGroup && client.practiceGroup !== filters.practiceGroup) return false;
      if (filters.revenueMin && client.revenue < filters.revenueMin) return false;
      if (filters.revenueMax && client.revenue > filters.revenueMax) return false;
      return true;
    });
  }, [filters, allClientPerformance]);

  const kpis = [
    {
      title: 'Net Collection Rate',
      value: '94.2%',
      target: '95%',
      change: '+2.1%',
      trend: 'up',
      description: 'Percentage of collectible revenue actually collected'
    },
    {
      title: 'First Pass Resolution',
      value: '87.3%',
      target: '90%',
      change: '+5.2%',
      trend: 'up',
      description: 'Claims approved on first submission'
    },
    {
      title: 'Days in AR',
      value: '28.5',
      target: '30',
      change: '-5.2%',
      trend: 'down',
      description: 'Average days to collect payment'
    },
    {
      title: 'Denial Rate',
      value: '5.8%',
      target: '<6%',
      change: '-0.1%',
      trend: 'down',
      description: 'Percentage of claims initially denied'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
          <p className="text-gray-600 mt-2">Track KPIs and analyze billing performance trends</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Filters */}
      <PerformanceFilters
        onFilterChange={setFilters}
        availableClients={availableClients}
        availablePracticeGroups={availablePracticeGroups}
      />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
              <Target className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-baseline space-x-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
              <span className="text-sm text-gray-500">/ {kpi.target}</span>
            </div>
            <div className="flex items-center mb-2">
              {kpi.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-600 mr-1" />
              )}
              <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-green-600'}`}>
                {kpi.change}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
            <p className="text-xs text-gray-500">{kpi.description}</p>
          </Card>
        ))}
      </div>

      {/* Revenue and Claims Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  fill="#2563eb"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Processed</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  formatter={(value: number) => [value, 'Claims']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="claims" 
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Client Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Client Performance</h3>
          <span className="text-sm text-gray-500">
            Showing {filteredClientPerformance.length} of {allClientPerformance.length} clients
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Client</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Practice Group</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Claims</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Denial Rate</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientPerformance.map((client, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{client.name}</td>
                  <td className="py-3 px-4 text-gray-600">{client.practiceGroup}</td>
                  <td className="py-3 px-4 text-gray-600">${client.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-600">{client.claims}</td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${client.denialRate < 5 ? 'text-green-600' : client.denialRate < 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {client.denialRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-green-600">
                      {client.satisfaction}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Performance;
