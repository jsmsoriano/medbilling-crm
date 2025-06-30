
import { ClientPerformanceData } from '@/utils/pdf/types';
import { generateMockDate } from '@/utils/reports/dateUtils';
import ClientPerformanceTable from './tables/ClientPerformanceTable';
import ARAgingTable from './tables/ARAgingTable';
import PaymentCollectionTrendTable from './tables/PaymentCollectionTrendTable';
import GenericReportTable from './tables/GenericReportTable';
import TransactionsList from './TransactionsList';
import { DateRange } from 'react-day-picker';

interface ReportDataTableProps {
  filteredData: ClientPerformanceData[];
  reportType?: string;
  dateRange?: DateRange;
}

const ReportDataTable = ({ filteredData, reportType = 'client-performance', dateRange }: ReportDataTableProps) => {
  const renderTable = () => {
    // If date range is selected, show transactions list
    if (dateRange?.from && dateRange?.to) {
      return <TransactionsList filteredData={filteredData} dateRange={dateRange} reportType={reportType} />;
    }

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
