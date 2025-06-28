
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
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
  onGeneratePDF: () => void;
  isGenerating: boolean;
  hasData: boolean;
}

const ReportPreview = ({ filteredData, onGeneratePDF, isGenerating, hasData }: ReportPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Report Preview</CardTitle>
            <p className="text-sm text-gray-600">
              Showing {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
            </p>
          </div>
          <Button 
            onClick={onGeneratePDF} 
            disabled={isGenerating || !hasData}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate PDF'}
          </Button>
        </div>
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
