
import { ClientPerformanceData } from '@/utils/pdf/types';
import { generateMockDate } from '@/utils/reports/dateUtils';
import ClientPerformanceTable from './tables/ClientPerformanceTable';
import ARAgingTable from './tables/ARAgingTable';
import PaymentCollectionTrendTable from './tables/PaymentCollectionTrendTable';
import GenericReportTable from './tables/GenericReportTable';

interface ReportDataTableProps {
  filteredData: ClientPerformanceData[];
  reportType?: string;
}

const ReportDataTable = ({ filteredData, reportType = 'client-performance' }: ReportDataTableProps) => {
  const renderTable = () => {
    switch (reportType) {
      case 'ar-aging':
        return <ARAgingTable filteredData={filteredData} generateMockDate={generateMockDate} />;
      case 'payment-collection-trend':
        return <PaymentCollectionTrendTable filteredData={filteredData} generateMockDate={generateMockDate} />;
      case 'client-performance':
        return <ClientPerformanceTable filteredData={filteredData} generateMockDate={generateMockDate} />;
      default:
        return <GenericReportTable filteredData={filteredData} generateMockDate={generateMockDate} reportType={reportType} />;
    }
  };

  return renderTable();
};

export default ReportDataTable;
