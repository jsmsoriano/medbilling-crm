
import { Card } from '@/components/ui/card';

interface ClientPerformanceData {
  name: string;
  revenue: number;
  claims: number;
  denialRate: number;
  satisfaction: number;
  practiceGroup: string;
}

interface ReportSummaryCardsProps {
  filteredData: ClientPerformanceData[];
}

const ReportSummaryCards = ({ filteredData }: ReportSummaryCardsProps) => {
  const totalRevenue = filteredData.reduce((sum, client) => sum + client.revenue, 0);
  const totalClaims = filteredData.reduce((sum, client) => sum + client.claims, 0);
  const avgDenialRate = filteredData.length > 0 ? 
    (filteredData.reduce((sum, client) => sum + client.denialRate, 0) / filteredData.length).toFixed(1) : '0';
  const avgSatisfaction = filteredData.length > 0 ? 
    (filteredData.reduce((sum, client) => sum + client.satisfaction, 0) / filteredData.length).toFixed(1) : '0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="text-sm text-gray-600">Total Revenue</div>
        <div className="text-2xl font-bold">
          ${totalRevenue.toLocaleString()}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-gray-600">Total Claims</div>
        <div className="text-2xl font-bold">
          {totalClaims}
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-gray-600">Avg Denial Rate</div>
        <div className="text-2xl font-bold">
          {avgDenialRate}%
        </div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-gray-600">Avg Satisfaction</div>
        <div className="text-2xl font-bold">
          {avgSatisfaction}%
        </div>
      </Card>
    </div>
  );
};

export default ReportSummaryCards;
