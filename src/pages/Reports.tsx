
import { useState } from 'react';
import ReportsHeader from '@/components/reports/ReportsHeader';
import ReportConfiguration from '@/components/reports/ReportConfiguration';
import ReportPreview from '@/components/reports/ReportPreview';
import { ReportConfig } from '@/components/reports/ReportConfiguration';

const Reports = () => {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    reportType: '',
    dateRange: { from: new Date(), to: new Date() },
    clients: [],
    metrics: [],
    groupBy: 'month',
    compareData: false,
    exportFormat: 'pdf'
  });

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
            config={reportConfig}
            onConfigChange={setReportConfig}
          />
        </div>
        
        <div className="lg:col-span-2">
          <ReportPreview config={reportConfig} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
