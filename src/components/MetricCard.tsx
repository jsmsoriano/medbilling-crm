
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
}

const MetricCard = ({ title, value, change, trend, icon: Icon, color }: MetricCardProps) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
    indigo: 'text-indigo-600 bg-indigo-50'
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-sm font-medium",
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
