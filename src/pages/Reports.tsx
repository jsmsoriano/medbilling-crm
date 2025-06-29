
import { useState } from 'react';
import ReportsHeader from '@/components/reports/ReportsHeader';
import ReportConfiguration from '@/components/reports/ReportConfiguration';
import ReportPreview from '@/components/reports/ReportPreview';
import { useReportData } from '@/hooks/useReportData';
import { FileText, BarChart3, TrendingUp, Users, DollarSign, AlertTriangle, Clock, Target } from 'lucide-react';

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('client-performance');
  const [selectedClient, setSelectedClient] = useState('all-clients');
  const [selectedPracticeGroup, setSelectedPracticeGroup] = useState('all-groups');
  const [isGenerating, setIsGenerating] = useState(false);

  const { availableClients, availablePracticeGroups, getFilteredData, getReportData } = useReportData();

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
    <div className="space-y-6 p-6">
      <div className="text-center w-full">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">Generate and analyze comprehensive billing reports</p>
      </div>
      
      <ReportsHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
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
          />
        </div>
        
        <div className="lg:col-span-2">
          <ReportPreview 
            filteredData={filteredData}
            onGeneratePDF={handleGeneratePDF}
            onExportData={handleExportData}
            isGenerating={isGenerating}
            hasData={filteredData.length > 0}
            reportType={selectedReportType}
            reportTypes={reportTypes}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
