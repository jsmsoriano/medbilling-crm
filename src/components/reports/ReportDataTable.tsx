
interface ClientPerformanceData {
  name?: string;
  revenue?: number;
  claims?: number;
  denialRate?: number;
  satisfaction?: number;
  practiceGroup?: string;
  [key: string]: any;
}

interface ReportDataTableProps {
  filteredData: ClientPerformanceData[];
  reportType?: string;
}

const ReportDataTable = ({ filteredData, reportType = 'client-performance' }: ReportDataTableProps) => {
  // Generate mock dates for demonstration
  const generateMockDate = (index: number) => {
    const today = new Date();
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    return date.toLocaleDateString();
  };

  const renderTableHeaders = () => {
    switch (reportType) {
      case 'ar-aging':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">0-30 Days</th>
            <th className="border border-gray-200 px-4 py-2 text-left">31-60 Days</th>
            <th className="border border-gray-200 px-4 py-2 text-left">61-90 Days</th>
            <th className="border border-gray-200 px-4 py-2 text-left">90+ Days</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Total</th>
          </tr>
        );
      case 'payment-collection-trend':
        return (
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Collections</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Payment Rate</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Trend</th>
          </tr>
        );
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
            <th className="border border-gray-200 px-4 py-2 text-left">Practice Group</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Revenue</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Claims</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Denial Rate</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Satisfaction</th>
          </tr>
        );
    }
  };

  const renderTableRows = () => {
    return filteredData.map((item, index) => {
      switch (reportType) {
        case 'ar-aging':
          return (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                {generateMockDate(index)}
              </td>
              <td className="border border-gray-200 px-4 py-2 font-medium">{item.name || 'N/A'}</td>
              <td className="border border-gray-200 px-4 py-2">${Math.floor(Math.random() * 5000).toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-2">${Math.floor(Math.random() * 3000).toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-2">${Math.floor(Math.random() * 2000).toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-2">${Math.floor(Math.random() * 1000).toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-2 font-medium">${Math.floor(Math.random() * 11000).toLocaleString()}</td>
            </tr>
          );
        case 'payment-collection-trend':
          return (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                {generateMockDate(index)}
              </td>
              <td className="border border-gray-200 px-4 py-2 font-medium">{item.name || 'N/A'}</td>
              <td className="border border-gray-200 px-4 py-2">${Math.floor(Math.random() * 10000).toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-2">{(85 + Math.random() * 10).toFixed(1)}%</td>
              <td className="border border-gray-200 px-4 py-2">
                <span className="text-green-600">↗ +{(Math.random() * 5).toFixed(1)}%</span>
              </td>
            </tr>
          );
        default:
          return (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                {generateMockDate(index)}
              </td>
              <td className="border border-gray-200 px-4 py-2 font-medium">{item.name || 'N/A'}</td>
              <td className="border border-gray-200 px-4 py-2">{item.practiceGroup || 'N/A'}</td>
              <td className="border border-gray-200 px-4 py-2">${(item.revenue || 0).toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-2">{item.claims || 0}</td>
              <td className="border border-gray-200 px-4 py-2">
                <span className={`font-medium ${(item.denialRate || 0) < 5 ? 'text-green-600' : (item.denialRate || 0) < 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {item.denialRate || 0}%
                </span>
              </td>
              <td className="border border-gray-200 px-4 py-2">
                <span className="font-medium text-green-600">{item.satisfaction || 0}%</span>
              </td>
            </tr>
          );
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          {renderTableHeaders()}
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
    </div>
  );
};

export default ReportDataTable;
