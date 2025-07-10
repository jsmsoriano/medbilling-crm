
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import ReportSummaryCards from './ReportSummaryCards';
import ReportDataTable from './ReportDataTable';
import { ClientPerformanceData } from '@/utils/pdf/types';
import { DateRange } from 'react-day-picker';

interface ReportType {
  value: string;
  label: string;
  icon: any;
}

interface ReportPreviewProps {
  filteredData: ClientPerformanceData[];
  onGeneratePDF: () => void;
  onExportData: () => void;
  isGenerating: boolean;
  hasData: boolean;
  reportType: string;
  dateRange: DateRange | undefined;
}

const ReportPreview = ({ 
  filteredData, 
  onGeneratePDF, 
  onExportData,
  isGenerating, 
  hasData, 
  reportType,
  dateRange
}: ReportPreviewProps) => {
  const reportTypeLabels: Record<string, string> = {
    'client-performance': 'Client Performance',
    'ar-aging': 'AR Aging Report',
    'payment-collection-trend': 'Payment Collection Trend',
    'insurance-carrier-analysis': 'Insurance Carrier Analysis',
    'payment-collections': 'Payment Collections',
    'clearing-house-rejections': 'Clearing House Rejections',
    'payer-reimbursement-metrics': 'Payer Reimbursement Metrics',
    'denials-report': 'Denials Report',
    'cpt-analysis-revenue': 'CPT Analysis Revenue',
    'claims-submitted': 'Claims Submitted'
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{reportTypeLabels[reportType] || 'Report Preview'}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
              {dateRange?.from && dateRange?.to && (
                <span className="ml-2">
                  from {dateRange.from.toLocaleDateString()} to {dateRange.to.toLocaleDateString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={onExportData} 
              disabled={isGenerating || !hasData}
              variant="outline"
              size="sm"
              className="hover-scale"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={onGeneratePDF} 
              disabled={isGenerating || !hasData}
              size="sm"
              className="hover-scale"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'PDF'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {filteredData.length > 0 ? (
          <div className="space-y-6 pl-6 pr-3 py-6">
            {reportType === 'client-performance' && (
              <ReportSummaryCards filteredData={filteredData} />
            )}
            <ReportDataTable 
              filteredData={filteredData} 
              reportType={reportType}
              dateRange={dateRange}
            />
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium mb-2">No data found</h3>
            <p className="text-sm">Try adjusting your filters to see results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportPreview;
