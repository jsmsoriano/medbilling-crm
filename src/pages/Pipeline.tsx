import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProspectDialog, { Prospect } from '@/components/ProspectDialog';
import PipelineFilters, { PipelineFilter } from '@/components/PipelineFilters';
import ProspectActivityTracker from '@/components/ProspectActivityTracker';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { 
  Plus, 
  Clock, 
  DollarSign, 
  Users,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  FileText,
  History
} from 'lucide-react';

const Pipeline = () => {
  const [prospects, setProspects] = useState<Prospect[]>([
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
      source: 'Referral',
      notes: 'Interested in comprehensive billing services. Follow up on insurance credentialing requirements.',
      practiceName: 'Valley Medical Group',
      groupName: 'Valley Health System',
      practiceType: 'Family Practice',
      numberOfProviders: 3,
      decisionMaker: 'Dr. Amanda Thompson',
      currentBillingPartner: 'ABC Billing',
      painPoints: 'High denial rates, slow collections',
      budget: 30000,
      timeline: '60 days',
      referredBy: 'Dr. Johnson',
      territory: 'North Region',
      priority: 'High'
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
      source: 'Website',
      notes: 'Reviewing our proposal. Concerns about transition timeline. Need to address staff training.',
      practiceName: 'Coastal Orthopedics',
      practiceType: 'Orthopedics',
      numberOfProviders: 5,
      decisionMaker: 'Dr. Robert Martinez',
      currentBillingPartner: 'In-house',
      painPoints: 'Staffing issues, compliance concerns',
      budget: 40000,
      timeline: '90 days',
      territory: 'South Region',
      priority: 'Medium'
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
      source: 'Cold Outreach',
      notes: 'Contract under legal review. Very interested. Expect to close within 2 weeks.',
      practiceName: 'Family Care Center',
      practiceType: 'Family Practice',
      numberOfProviders: 2,
      decisionMaker: 'Dr. Jennifer Lee',
      currentBillingPartner: 'XYZ Medical Billing',
      painPoints: 'Poor customer service, billing errors',
      budget: 20000,
      timeline: '30 days',
      territory: 'East Region',
      priority: 'High'
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
      source: 'LinkedIn',
      notes: 'Initial contact made. Scheduled discovery call to understand their current billing challenges.',
      practiceName: 'Urgent Care Plus',
      practiceType: 'Urgent Care',
      numberOfProviders: 4,
      decisionMaker: 'Dr. Mark Wilson',
      currentBillingPartner: 'Internal',
      painPoints: 'High volume, quick turnaround needed',
      budget: 25000,
      timeline: '45 days',
      territory: 'West Region',
      priority: 'Medium'
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
      source: 'Referral',
      notes: 'Strong referral from existing client. Looking to improve denial rates and AR management.',
      practiceName: 'Mental Health Associates',
      practiceType: 'Mental Health',
      numberOfProviders: 6,
      decisionMaker: 'Dr. Susan Davis',
      currentBillingPartner: 'MH Billing Services',
      painPoints: 'Complex insurance requirements, prior auths',
      budget: 32000,
      timeline: '75 days',
      referredBy: 'Coastal Family Practice',
      territory: 'Central Region',
      priority: 'High'
    }
  ]);

  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [dialogMode, setDialogMode] = useState<'edit' | 'stage'>('edit');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<PipelineFilter>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showActivityTracker, setShowActivityTracker] = useState(false);
  const [activityProspect, setActivityProspect] = useState<Prospect | null>(null);

  const pipelineStages = [
    { name: 'Prospects', count: 0, value: 0, color: 'blue' },
    { name: 'Qualified', count: 0, value: 0, color: 'yellow' },
    { name: 'Proposal', count: 0, value: 0, color: 'orange' },
    { name: 'Negotiation', count: 0, value: 0, color: 'red' },
    { name: 'Closed Won', count: 0, value: 0, color: 'green' }
  ];

  const availableStages = Array.from(new Set(prospects.map(p => p.stage)));
  const availableSources = Array.from(new Set(prospects.map(p => p.source)));

  // Filter prospects based on active filters
  const filteredProspects = useMemo(() => {
    return prospects.filter(prospect => {
      if (filters.stage && prospect.stage !== filters.stage) return false;
      if (filters.source && prospect.source !== filters.source) return false;
      if (filters.probabilityMin && prospect.probability < filters.probabilityMin) return false;
      if (filters.probabilityMax && prospect.probability > filters.probabilityMax) return false;
      if (filters.valueMin && prospect.value < filters.valueMin) return false;
      if (filters.valueMax && prospect.value > filters.valueMax) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return prospect.name.toLowerCase().includes(searchLower) ||
               prospect.contact.toLowerCase().includes(searchLower) ||
               prospect.email.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }, [prospects, filters]);

  // Calculate stage metrics
  pipelineStages.forEach(stage => {
    const stageProspects = filteredProspects.filter(p => p.stage === stage.name);
    stage.count = stageProspects.length;
    stage.value = stageProspects.reduce((sum, p) => sum + p.value, 0);
  });

  const handleEditProspect = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleUpdateStage = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setDialogMode('stage');
    setIsDialogOpen(true);
  };

  const handleShowActivity = (prospect: Prospect) => {
    setActivityProspect(prospect);
    setShowActivityTracker(true);
  };

  const handleSaveProspect = (updatedProspect: Prospect) => {
    setProspects(prev => 
      prev.map(p => p.id === updatedProspect.id ? updatedProspect : p)
    );
  };

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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="text-center w-full">
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

      {/* Active Prospects with integrated filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 text-center flex-grow">Active Prospects</h2>
            <span className="text-sm text-gray-500">
              Showing {filteredProspects.length} of {prospects.length} prospects
            </span>
          </div>
          
          {/* Integrated Pipeline Filters */}
          <PipelineFilters
            onFilterChange={setFilters}
            onViewChange={setViewMode}
            currentView={viewMode}
            availableStages={availableStages}
            availableSources={availableSources}
          />
        </div>
        
        {viewMode === 'list' ? (
          <div className="overflow-x-auto mt-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Stage</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Value</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Probability</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Source</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProspects.map((prospect) => (
                  <tr key={prospect.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{prospect.name}</td>
                    <td className="py-3 px-4 text-gray-600">{prospect.contact}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStageColor(prospect.stage)}>
                        {prospect.stage}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-600">${prospect.value.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${getProbabilityColor(prospect.probability)}`}>
                        {prospect.probability}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{prospect.source}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditProspect(prospect)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleUpdateStage(prospect)}
                        >
                          Update
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleShowActivity(prospect)}
                        >
                          <History className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            {filteredProspects.map((prospect) => (
              <div key={prospect.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{prospect.name}</h3>
                    <p className="text-sm text-gray-600">{prospect.contact}</p>
                    {prospect.practiceName && (
                      <p className="text-sm text-gray-500">Practice: {prospect.practiceName}</p>
                    )}
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

                {prospect.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <div className="flex items-start">
                      <FileText className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                        <p className="text-sm text-gray-600">{prospect.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

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
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditProspect(prospect)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleUpdateStage(prospect)}
                    >
                      Update Stage
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleShowActivity(prospect)}
                    >
                      <History className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ProspectDialog
        prospect={selectedProspect}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProspect}
        mode={dialogMode}
      />

      <Dialog open={showActivityTracker} onOpenChange={setShowActivityTracker}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          {activityProspect && (
            <div className="p-6">
              <ProspectActivityTracker 
                prospectId={activityProspect.id}
                prospectName={activityProspect.name}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pipeline;
