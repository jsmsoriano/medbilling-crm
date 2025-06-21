
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientOverview = () => {
  const topClients = [
    {
      id: 1,
      name: 'Metro Medical Center',
      revenue: '$15,420',
      claims: 45,
      status: 'active',
      trend: 'up',
      change: '+12%'
    },
    {
      id: 2,
      name: 'Sunrise Family Practice',
      revenue: '$12,340',
      claims: 38,
      status: 'active',
      trend: 'up',
      change: '+8%'
    },
    {
      id: 3,
      name: 'Downtown Cardiology',
      revenue: '$9,850',
      claims: 29,
      status: 'active',
      trend: 'down',
      change: '-3%'
    },
    {
      id: 4,
      name: 'Pediatric Associates',
      revenue: '$8,720',
      claims: 31,
      status: 'active',
      trend: 'up',
      change: '+15%'
    },
    {
      id: 5,
      name: 'Women\'s Health Clinic',
      revenue: '$7,680',
      claims: 22,
      status: 'active',
      trend: 'up',
      change: '+5%'
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Clients</h3>
          <p className="text-sm text-gray-600">Highest revenue generating clients this month</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/clients">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="space-y-4">
        {topClients.map((client, index) => (
          <div key={client.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                <p className="text-xs text-gray-600">{client.claims} claims processed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{client.revenue}</p>
                <div className="flex items-center">
                  {client.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${client.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {client.change}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Active
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ClientOverview;
