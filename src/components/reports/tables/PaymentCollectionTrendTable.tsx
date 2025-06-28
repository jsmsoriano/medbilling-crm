
import { ClientPerformanceData } from '@/utils/pdf/types';

interface PaymentCollectionTrendTableProps {
  filteredData: ClientPerformanceData[];
  generateMockDate: (index: number) => string;
}

const PaymentCollectionTrendTable = ({ filteredData, generateMockDate }: PaymentCollectionTrendTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Collections</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Payment Rate</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Trend</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentCollectionTrendTable;
