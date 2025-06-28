
import { ClientPerformanceData } from '@/utils/pdf/types';

interface ARAgingTableProps {
  filteredData: ClientPerformanceData[];
  generateMockDate: (index: number) => string;
}

const ARAgingTable = ({ filteredData, generateMockDate }: ARAgingTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">0-30 Days</th>
            <th className="border border-gray-200 px-4 py-2 text-left">31-60 Days</th>
            <th className="border border-gray-200 px-4 py-2 text-left">61-90 Days</th>
            <th className="border border-gray-200 px-4 py-2 text-left">90+ Days</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ARAgingTable;
