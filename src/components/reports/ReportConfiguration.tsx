
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Filter, BarChart3, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ReportType {
  value: string;
  label: string;
  icon: any;
}

interface ReportConfigurationProps {
  selectedReportType: string;
  setSelectedReportType: (value: string) => void;
  selectedClient: string;
  setSelectedClient: (value: string) => void;
  selectedPracticeGroup: string;
  setSelectedPracticeGroup: (value: string) => void;
  availableClients: string[];
  availablePracticeGroups: string[];
  onGeneratePDF: () => void;
  isGenerating: boolean;
  hasData: boolean;
}

const ReportConfiguration = ({
  selectedReportType,
  setSelectedReportType,
  selectedClient,
  setSelectedClient,
  selectedPracticeGroup,
  setSelectedPracticeGroup,
  availableClients,
  availablePracticeGroups,
  onGeneratePDF,
  isGenerating,
  hasData
}: ReportConfigurationProps) => {
  const { toast } = useToast();
  
  const reportTypes: ReportType[] = [
    { value: 'client-performance', label: 'Client Performance Report', icon: BarChart3 },
    { value: 'revenue-analysis', label: 'Revenue Analysis Report', icon: FileText },
    { value: 'claims-management', label: 'Claims Management Report', icon: FileText },
  ];

  const handlePDFGeneration = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Your report is being prepared for download.",
      });

      // Call the original PDF generation function
      await onGeneratePDF();
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your report has been downloaded.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF report.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Report Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={selectedReportType} onValueChange={setSelectedReportType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      <span className="truncate">{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Client Filter</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All clients" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all-clients">All clients</SelectItem>
                {availableClients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Practice Group</Label>
            <Select value={selectedPracticeGroup} onValueChange={setSelectedPracticeGroup}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All practice groups" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all-groups">All practice groups</SelectItem>
                {availablePracticeGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Actions</Label>
            <Button 
              onClick={handlePDFGeneration} 
              disabled={isGenerating || !hasData}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Export PDF'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportConfiguration;
