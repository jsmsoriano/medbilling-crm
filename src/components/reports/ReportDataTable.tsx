
interface ClientPerformanceData {
  name: string;
  revenue: number;
  claims: number;
  denialRate: number;
  satisfaction: number;
  practiceGroup: string;
}

interface ReportDataTableProps {
  filteredData: ClientPerformanceData[];
}

const ReportDataTable = ({ filteredData }: ReportDataTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Practice Group</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Revenue</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Claims</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Denial Rate</th>
            <th className="border border-gray-200 px-4 py-2 text-left">Satisfaction</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((client, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-200 px-4 py-2 font-medium">{client.name}</td>
              <td className="border border-gray-200 px-4 py-2">{client.practiceGroup}</td>
              <td className="border border-gray-200 px-4 py-2">${client.revenue.toLocaleString()}</td>
              <td className="border border-gray-200 px-4 py-2">{client.claims}</td>
              <td className="border border-gray-200 px-4 py-2">
                <span className={`font-medium ${client.denialRate < 5 ? 'text-green-600' : client.denialRate < 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {client.denialRate}%
                </span>
              </td>
              <td className="border border-gray-200 px-4 py-2">
                <span className="font-medium text-green-600">{client.satisfaction}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportDataTable;
