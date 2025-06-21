
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ClaimStatusChart = () => {
  const data = [
    { name: 'Approved', value: 1156, color: '#10b981' },
    { name: 'Pending', value: 89, color: '#f59e0b' },
    { name: 'Denied', value: 73, color: '#ef4444' },
    { name: 'Under Review', value: 45, color: '#6366f1' },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Claims Status</h3>
        <p className="text-sm text-gray-600">Current month claims breakdown</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value.toLocaleString(), 'Claims']}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color, fontWeight: 500 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ClaimStatusChart;
