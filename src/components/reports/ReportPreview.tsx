
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import ReportSummaryCards from './ReportSummaryCards';
import ReportDataTable from './ReportDataTable';

interface ClientPerformanceData {
  name: string;
  revenue: number;
  claims: number;
  denialRate: number;
  satisfaction: number;
  practiceGroup: string;
}

interface ReportPreviewProps {
  filteredData: ClientPerformanceData[];
}

const ReportPreview = ({ filteredData }: ReportPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Preview</CardTitle>
        <p className="text-sm text-gray-600">
          Showing {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
        </p>
      </CardHeader>
      <CardContent>
        {filteredData.length > 0 ? (
          <>
            <ReportSummaryCards filteredData={filteredData} />
            <ReportDataTable filteredData={filteredData} />
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No data matches the selected filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportPreview;
