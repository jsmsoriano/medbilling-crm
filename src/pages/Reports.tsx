
import { useState } from 'react';
import PerformanceFilters, { PerformanceFilter } from '@/components/PerformanceFilters';
import ReportConfiguration from '@/components/reports/ReportConfiguration';
import ReportPreview from '@/components/reports/ReportPreview';
import ReportsHeader from '@/components/reports/ReportsHeader';
import KPIMetrics from '@/components/reports/KPIMetrics';
import RevenueAndClaimsCharts from '@/components/reports/RevenueAndClaimsCharts';
import { useReportData } from '@/hooks/useReportData';
import { generateReportPDF } from '@/utils/pdfGenerator';

const Reports = () => {
  const [filters, setFilters] = useState<PerformanceFilter>({});
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

  const monthlyData = [
    { month: 'Jan', revenue: 65000, claims: 234, denialRate: 8.2, arDays: 32 },
    { month: 'Feb', revenue: 71000, claims: 267, denialRate: 7.8, arDays: 30 },
    { month: 'Mar', revenue: 68000, claims: 245, denialRate: 9.1, arDays: 34 },
    { month: 'Apr', revenue: 75000, claims: 289, denialRate: 6.5, arDays: 28 },
    { month: 'May', revenue: 82000, claims: 312, denialRate: 5.9, arDays: 26 },
    { month: 'Jun', revenue: 87430, claims: 347, denialRate: 5.8, arDays: 28.5 },
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
    } finally {
      setIsGenerating(false);
    }
  };

  const kpis = [
    {
      title: 'Net Collection Rate',
      value: '94.2%',
      target: '95%',
      change: '+2.1%',
      trend: 'up' as const,
      description: 'Percentage of collectible revenue actually collected',
      redirectTo: '/performance?filter=collection-rate'
    },
    {
      title: 'First Pass Resolution',
      value: '87.3%',
      target: '90%',
      change: '+5.2%',
      trend: 'up' as const,
      description: 'Claims approved on first submission',
      redirectTo: '/performance?filter=first-pass'
    },
    {
      title: 'Days in AR',
      value: '28.5',
      target: '30',
      change: '-5.2%',
      trend: 'down' as const,
      description: 'Average days to collect payment',
      redirectTo: '/performance?filter=ar-days'
    },
    {
      title: 'Denial Rate',
      value: '5.8%',
      target: '<6%',
      change: '-0.1%',
      trend: 'down' as const,
      description: 'Percentage of claims initially denied',
      redirectTo: '/performance?filter=denial-rate'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Reports Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ReportsHeader />
        </div>

        {/* Performance Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <PerformanceFilters
            onFilterChange={setFilters}
            availableClients={availableClients}
            availablePracticeGroups={availablePracticeGroups}
          />
        </div>

        {/* Key Performance Indicators */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Key Performance Indicators</h2>
            <p className="text-gray-600">Monitor your most important metrics at a glance</p>
          </div>
          <KPIMetrics kpis={kpis} />
        </div>

        {/* Revenue and Claims Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Performance Trends</h2>
            <p className="text-gray-600">Track revenue and claims processing over time</p>
          </div>
          <RevenueAndClaimsCharts monthlyData={monthlyData} />
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
          <ReportPreview filteredData={filteredReportData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
