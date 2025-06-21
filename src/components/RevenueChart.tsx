
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = () => {
  const data = [
    { month: 'Jan', revenue: 65000, collections: 62000 },
    { month: 'Feb', revenue: 71000, collections: 68000 },
    { month: 'Mar', revenue: 68000, collections: 65000 },
    { month: 'Apr', revenue: 75000, collections: 72000 },
    { month: 'May', revenue: 82000, collections: 78000 },
    { month: 'Jun', revenue: 87430, collections: 83200 },
  ];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue & Collections</h3>
        <p className="text-sm text-gray-600">Monthly revenue vs collections over time</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              labelStyle={{ color: '#374151' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#2563eb" 
              strokeWidth={3}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
              name="Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="collections" 
              stroke="#059669" 
              strokeWidth={3}
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              name="Collections"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RevenueChart;
