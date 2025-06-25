
import { useState } from 'react';
import ReportConfiguration from '@/components/reports/ReportConfiguration';
import ReportPreview from '@/components/reports/ReportPreview';
import { useReportData } from '@/hooks/useReportData';
import { generateReportPDF } from '@/utils/pdfGenerator';
import { BarChart3, FileText } from 'lucide-react';

const Reports = () => {
  const {
    clients,
    claims,
    loading,
    availableClients,
    availablePracticeGroups,
    getFilteredData
  } = useReportData();

  const [selectedReportType, setSelectedReportType] = useState('client-performance');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPracticeGroup, setSelectedPracticeGroup] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'client-performance', label: 'Client Performance Report', icon: BarChart3 },
    { value: 'revenue-analysis', label: 'Revenue Analysis Report', icon: FileText },
    { value: 'claims-management', label: 'Claims Management Report', icon: FileText },
  ];

  const filteredData = getFilteredData(selectedClient, selectedPracticeGroup);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      await generateReportPDF(
        selectedReportType,
        reportTypes,
        filteredData,
        selectedClient,
        selectedPracticeGroup
      );
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate comprehensive reports with advanced filtering and PDF export</p>
        </div>
      </div>

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
        hasData={filteredData.length > 0}
      />

      <ReportPreview filteredData={filteredData} />
    </div>
  );
};

export default Reports;
