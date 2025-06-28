
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
    getFilteredData,
    getReportData
  } = useReportData();

  const reportTypes = [
    { value: 'client-performance', label: 'Client Performance Report', icon: 'BarChart3' },
    { value: 'ar-aging', label: 'AR Aging Report', icon: 'FileText' },
    { value: 'payment-collection-trend', label: 'Payment and Collection Trend Report', icon: 'FileText' },
    { value: 'insurance-carrier-analysis', label: 'Insurance Carrier Analysis Report', icon: 'FileText' },
    { value: 'payment-collections', label: 'Payment Collections Report', icon: 'FileText' },
    { value: 'clearing-house-rejections', label: 'Clearing House Rejections Report', icon: 'FileText' },
    { value: 'payer-reimbursement-metrics', label: 'Payer Reimbursement Metrics Report', icon: 'FileText' },
    { value: 'denials-report', label: 'Denials Report', icon: 'FileText' },
    { value: 'cpt-analysis-revenue', label: 'CPT Analysis Revenue Report', icon: 'FileText' },
    { value: 'claims-submitted', label: 'Number of Claims Submitted', icon: 'FileText' },
  ];

  // Handle the "all-clients" and "all-groups" values from the select components
  const processedSelectedClient = selectedClient === 'all-clients' ? '' : selectedClient;
  const processedSelectedPracticeGroup = selectedPracticeGroup === 'all-groups' ? '' : selectedPracticeGroup;
  
  const filteredReportData = selectedReportType === 'client-performance' 
    ? getFilteredData(processedSelectedClient, processedSelectedPracticeGroup)
    : getReportData(selectedReportType);

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
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportData = () => {
    console.log('Exporting data for report type:', selectedReportType);
    
    // Convert report data to CSV format
    if (filteredReportData.length === 0) return;
    
    const headers = Object.keys(filteredReportData[0]);
    const csvData = [
      headers.join(','),
      ...filteredReportData.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const reportLabel = reportTypes.find(type => type.value === selectedReportType)?.label || 'Report';
    a.download = `${reportLabel.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
            reportTypes={reportTypes}
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
            onExportData={handleExportData}
            isGenerating={isGenerating}
            hasData={filteredReportData.length > 0}
            reportType={selectedReportType}
            reportTypes={reportTypes}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
