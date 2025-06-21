
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Clock, 
  DollarSign, 
  Users,
  TrendingUp,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

const Pipeline = () => {
  const pipelineStages = [
    {
      name: 'Prospects',
      count: 12,
      value: 180000,
      color: 'blue'
    },
    {
      name: 'Qualified',
      count: 8,
      value: 140000,
      color: 'yellow'
    },
    {
      name: 'Proposal',
      count: 5,
      value: 95000,
      color: 'orange'
    },
    {
      name: 'Negotiation',
      count: 3,
      value: 58000,
      color: 'red'
    },
    {
      name: 'Closed Won',
      count: 2,
      value: 35000,
      color: 'green'
    }
  ];

  const prospects = [
    {
      id: 1,
      name: 'Valley Medical Group',
      contact: 'Dr. Amanda Thompson',
      email: 'athompson@valleymedical.com',
      phone: '(555) 678-9012',
      stage: 'Qualified',
      value: 25000,
      probability: 75,
      nextAction: 'Send proposal',
      nextActionDate: '2024-01-15',
      lastContact: '2024-01-10',
      source: 'Referral'
    },
    {
      id: 2,
      name: 'Coastal Orthopedics',
      contact: 'Dr. Robert Martinez',
      email: 'rmartinez@coastalortho.com',
      phone: '(555) 789-0123',
      stage: 'Proposal',
      value: 35000,
      probability: 60,
      nextAction: 'Follow up call',
      nextActionDate: '2024-01-12',
      lastContact: '2024-01-08',
      source: 'Website'
    },
    {
      id: 3,
      name: 'Family Care Center',
      contact: 'Dr. Jennifer Lee',
      email: 'jlee@familycare.com',
      phone: '(555) 890-1234',
      stage: 'Negotiation',
      value: 18000,
      probability: 85,
      nextAction: 'Contract review',
      nextActionDate: '2024-01-14',
      lastContact: '2024-01-09',
      source: 'Cold Outreach'
    },
    {
      id: 4,
      name: 'Urgent Care Plus',
      contact: 'Dr. Mark Wilson',
      email: 'mwilson@urgentcareplus.com',
      phone: '(555) 901-2345',
      stage: 'Prospects',
      value: 22000,
      probability: 30,
      nextAction: 'Initial meeting',
      nextActionDate: '2024-01-16',
      lastContact: '2024-01-05',
      source: 'LinkedIn'
    },
    {
      id: 5,
      name: 'Mental Health Associates',
      contact: 'Dr. Susan Davis',
      email: 'sdavis@mentalhealth.com',
      phone: '(555) 012-3456',
      stage: 'Qualified',
      value: 28000,
      probability: 70,
      nextAction: 'Needs assessment',
      nextActionDate: '2024-01-13',
      lastContact: '2024-01-11',
      source: 'Referral'
    }
  ];

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'Prospects': 'bg-blue-100 text-blue-800',
      'Qualified': 'bg-yellow-100 text-yellow-800',
      'Proposal': 'bg-orange-100 text-orange-800',
      'Negotiation': 'bg-red-100 text-red-800',
      'Closed Won': 'bg-green-100 text-green-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-2">Track prospects and manage your sales process</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Prospect
        </Button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {pipelineStages.map((stage) => (
          <Card key={stage.name} className="p-4">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">{stage.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-2xl font-bold">{stage.count}</span>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <DollarSign className="w-3 h-3 mr-1" />
                  ${(stage.value / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Prospects List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Prospects</h2>
        <div className="space-y-4">
          {prospects.map((prospect) => (
            <div key={prospect.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{prospect.name}</h3>
                  <p className="text-sm text-gray-600">{prospect.contact}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStageColor(prospect.stage)}>
                    {prospect.stage}
                  </Badge>
                  <span className={`text-sm font-medium ${getProbabilityColor(prospect.probability)}`}>
                    {prospect.probability}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {prospect.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {prospect.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  ${prospect.value.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {prospect.source}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Next: {prospect.nextAction}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    Due: {new Date(prospect.nextActionDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm">Update Stage</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Pipeline;
