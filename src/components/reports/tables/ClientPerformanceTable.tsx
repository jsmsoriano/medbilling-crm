
import { ClientPerformanceData } from '@/utils/pdf/types';

interface ClientPerformanceTableProps {
  filteredData: ClientPerformanceData[];
  generateMockDate: (index: number) => string;
}

const ClientPerformanceTable = ({ filteredData, generateMockDate }: ClientPerformanceTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Practice Group</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Revenue</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Claims</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Denial Rate</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Satisfaction</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientPerformanceTable;
