
import { useState } from 'react';
import ReportConfiguration from '@/components/reports/ReportConfiguration';
import ReportPreview from '@/components/reports/ReportPreview';
import { useReportData } from '@/hooks/useReportData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BarChart3, TrendingUp, Users, DollarSign, AlertTriangle, Clock, Target } from 'lucide-react';
import { DateRange } from 'react-day-picker';

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('client-performance');
  const [selectedClient, setSelectedClient] = useState('all-clients');
  const [selectedPracticeGroup, setSelectedPracticeGroup] = useState('all-groups');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const { availableClients, availablePracticeGroups, getFilteredData } = useReportData();

  const reportTypes = [
    { value: 'client-performance', label: 'Client Performance', icon: BarChart3 },
    { value: 'ar-aging', label: 'AR Aging Report', icon: Clock },
    { value: 'payment-collection-trend', label: 'Payment Collection Trend', icon: TrendingUp },
    { value: 'insurance-carrier-analysis', label: 'Insurance Carrier Analysis', icon: Users },
    { value: 'payment-collections', label: 'Payment Collections', icon: DollarSign },
    { value: 'clearing-house-rejections', label: 'Clearing House Rejections', icon: AlertTriangle },
    { value: 'payer-reimbursement-metrics', label: 'Payer Reimbursement Metrics', icon: Target },
    { value: 'denials-report', label: 'Denials Report', icon: FileText },
    { value: 'cpt-analysis-revenue', label: 'CPT Analysis Revenue', icon: BarChart3 },
    { value: 'claims-submitted', label: 'Claims Submitted', icon: FileText }
  ];

  const filteredData = getFilteredData(
    selectedClient === 'all-clients' ? '' : selectedClient,
    selectedPracticeGroup === 'all-groups' ? '' : selectedPracticeGroup
  );

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    // Mock PDF generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleExportData = () => {
    // Mock data export
    console.log('Exporting data...');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <header className="border-b border-border bg-background px-4 sm:px-6 py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">Generate and analyze comprehensive billing reports</p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Configuration */}
          <ReportConfiguration 
            selectedReportType={selectedReportType}
            setSelectedReportType={setSelectedReportType}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            selectedPracticeGroup={selectedPracticeGroup}
            setSelectedPracticeGroup={setSelectedPracticeGroup}
            availableClients={availableClients}
            availablePracticeGroups={availablePracticeGroups}
            reportTypes={reportTypes}
            onGeneratePDF={handleGeneratePDF}
            isGenerating={isGenerating}
            hasData={filteredData.length > 0}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />

          {/* Results */}
          <ReportPreview 
            filteredData={filteredData}
            onGeneratePDF={handleGeneratePDF}
            onExportData={handleExportData}
            isGenerating={isGenerating}
            hasData={filteredData.length > 0}
            reportType={selectedReportType}
            dateRange={dateRange}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
