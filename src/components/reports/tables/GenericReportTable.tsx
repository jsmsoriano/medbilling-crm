
import { ClientPerformanceData } from '@/utils/pdf/types';

interface GenericReportTableProps {
  filteredData: ClientPerformanceData[];
  generateMockDate: (index: number) => string;
  reportType: string;
}

const GenericReportTable = ({ filteredData, generateMockDate, reportType }: GenericReportTableProps) => {
  const getTableHeaders = () => {
    switch (reportType) {
      case 'insurance-carrier-analysis':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Insurance Carrier</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Claims Count</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Approval Rate</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Avg Processing Time</th>
          </tr>
        );
      case 'payment-collections':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Expected</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Collected</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Collection Rate</th>
          </tr>
        );
      case 'clearing-house-rejections':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Claim Number</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Rejection Reason</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
          </tr>
        );
      case 'payer-reimbursement-metrics':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Payer</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Avg Reimbursement</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Days to Payment</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Claims Volume</th>
          </tr>
        );
      case 'denials-report':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Denial Reason</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Amount</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
          </tr>
        );
      case 'cpt-analysis-revenue':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">CPT Code</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Description</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Volume</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Revenue</th>
          </tr>
        );
      case 'claims-submitted':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Claims Submitted</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Volume Change</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
          </tr>
        );
      default:
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Data</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
          </tr>
        );
    }
  };

  const getTableRows = () => {
    return filteredData.map((item, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
          {generateMockDate(index)}
        </td>
        <td className="border border-gray-200 px-4 py-2 font-medium">{item.name || 'N/A'}</td>
        <td className="border border-gray-200 px-4 py-2">Sample Data</td>
        <td className="border border-gray-200 px-4 py-2">Active</td>
      </tr>
    ));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          {getTableHeaders()}
        </thead>
        <tbody>
          {getTableRows()}
        </tbody>
      </table>
    </div>
  );
};

export default GenericReportTable;
