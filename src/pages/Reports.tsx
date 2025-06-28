
import { useState } from 'react';
import ReportConfiguration from '@/components/reports/ReportConfiguration';
import ReportPreview from '@/components/reports/ReportPreview';
import ReportsHeader from '@/components/reports/ReportsHeader';
import { useReportData } from '@/hooks/useReportData';
import { generateReportPDF } from '@/utils/pdfGenerator';

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('client-performance');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPracticeGroup, setSelectedPracticeGroup] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    clients,
    claims,
    loading,
    availableClients,
    availablePracticeGroups,
    getFilteredData
  } = useReportData();

  const reportTypes = [
    { value: 'client-performance', label: 'Client Performance Report', icon: 'BarChart3' },
    { value: 'revenue-analysis', label: 'Revenue Analysis Report', icon: 'FileText' },
    { value: 'claims-management', label: 'Claims Management Report', icon: 'FileText' },
  ];

  // Handle the "all-clients" and "all-groups" values from the select components
  const processedSelectedClient = selectedClient === 'all-clients' ? '' : selectedClient;
  const processedSelectedPracticeGroup = selectedPracticeGroup === 'all-groups' ? '' : selectedPracticeGroup;
  
  const filteredReportData = getFilteredData(processedSelectedClient, processedSelectedPracticeGroup);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await generateReportPDF(
        selectedReportType,
        reportTypes,
        filteredReportData,
        processedSelectedClient,
        processedSelectedPracticeGroup
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error; // Re-throw to be handled by ReportConfiguration
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Reports Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ReportsHeader />
        </div>

        {/* Report Configuration */}
        <div className="bg-white rounded-lg shadow-sm">
          <ReportConfiguration
            selectedReportType={selectedReportType}
            setSelectedReportType={setSelectedReportType}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            selectedPracticeGroup={selectedPracticeGroup}
            setSelectedPracticeGroup={setSelectedPracticeGroup}
            availableClients={availableClients}
            availablePracticeGroups={availablePracticeGroups}
            onGeneratePDF={handleGeneratePDF}
            isGenerating={isGenerating}
            hasData={filteredReportData.length > 0}
          />
        </div>

        {/* Report Preview with integrated client performance */}
        <div className="bg-white rounded-lg shadow-sm">
          <ReportPreview 
            filteredData={filteredReportData} 
            onGeneratePDF={handleGeneratePDF}
            isGenerating={isGenerating}
            hasData={filteredReportData.length > 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
