
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientPerformanceData } from '@/utils/pdf/types';
import { DateRange } from 'react-day-picker';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, FileText, AlertTriangle } from 'lucide-react';

interface ReportSummarySectionProps {
  filteredData: ClientPerformanceData[];
  reportType: string;
  selectedClient: string;
  dateRange?: DateRange;
}

const ReportSummarySection = ({ filteredData, reportType, selectedClient, dateRange }: ReportSummarySectionProps) => {
  // Calculate KPIs
  const totalRevenue = filteredData.reduce((sum, client) => sum + (client.revenue || 0), 0);
  const totalClaims = filteredData.reduce((sum, client) => sum + (client.claims || 0), 0);
  const avgDenialRate = filteredData.length > 0 ? 
    (filteredData.reduce((sum, client) => sum + (client.denialRate || 0), 0) / filteredData.length) : 0;
  const avgSatisfaction = filteredData.length > 0 ? 
    (filteredData.reduce((sum, client) => sum + (client.satisfaction || 0), 0) / filteredData.length) : 0;

  // Generate mock trend data for charts
  const trendData = [
    { month: 'Jan', revenue: totalRevenue * 0.8, claims: totalClaims * 0.9 },
    { month: 'Feb', revenue: totalRevenue * 0.85, claims: totalClaims * 0.95 },
    { month: 'Mar', revenue: totalRevenue * 0.9, claims: totalClaims * 1.0 },
    { month: 'Apr', revenue: totalRevenue * 0.95, claims: totalClaims * 1.05 },
    { month: 'May', revenue: totalRevenue * 1.0, claims: totalClaims * 1.1 },
    { month: 'Jun', revenue: totalRevenue * 1.05, claims: totalClaims * 1.15 },
  ];

  const denialData = [
    { name: 'Approved', value: totalClaims * (1 - avgDenialRate / 100), fill: '#10b981' },
    { name: 'Denied', value: totalClaims * (avgDenialRate / 100), fill: '#ef4444' },
  ];

  const clientRevenueData = filteredData.map(client => ({
    name: client.name,
    revenue: client.revenue || 0,
    claims: client.claims || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Summary</CardTitle>
        <p className="text-sm text-gray-600">
          Key performance indicators and analytics
          {selectedClient !== 'all-clients' && ` for ${selectedClient}`}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold">{totalClaims}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Denial Rate</p>
                <p className="text-2xl font-bold">{avgDenialRate.toFixed(1)}%</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Satisfaction</p>
                <p className="text-2xl font-bold">{avgSatisfaction.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <Card className="p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Claims Distribution Chart */}
          <Card className="p-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Claims Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={denialData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {denialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value.toFixed(0), 'Claims']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Client Revenue Comparison */}
          {filteredData.length > 1 && (
            <Card className="p-4 lg:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Client Revenue Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clientRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                      />
                      <Bar dataKey="revenue" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportSummarySection;
