
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import ReportSummaryCards from './ReportSummaryCards';
import ReportDataTable from './ReportDataTable';
import ReportConfiguration from './ReportConfiguration';
import ReportSummarySection from './ReportSummarySection';
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
  reportTypes: ReportType[];
  selectedReportType: string;
  setSelectedReportType: (value: string) => void;
  selectedClient: string;
  setSelectedClient: (value: string) => void;
  selectedPracticeGroup: string;
  setSelectedPracticeGroup: (value: string) => void;
  availableClients: string[];
  availablePracticeGroups: string[];
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const ReportPreview = ({ 
  filteredData, 
  onGeneratePDF, 
  onExportData,
  isGenerating, 
  hasData, 
  reportType,
  reportTypes,
  selectedReportType,
  setSelectedReportType,
  selectedClient,
  setSelectedClient,
  selectedPracticeGroup,
  setSelectedPracticeGroup,
  availableClients,
  availablePracticeGroups,
  dateRange,
  setDateRange
}: ReportPreviewProps) => {
  const currentReportType = reportTypes.find(type => type.value === reportType);

  return (
    <div className="space-y-6">
      {/* Report Configuration at the top */}
      <ReportConfiguration 
        selectedReportType={selectedReportType}
        setSelectedReportType={setSelectedReportType}
        selectedClient={selectedClient}
        setSelectedClient={setSelectedClient}
        selectedPracticeGroup={selectedPracticeGroup}
        setSelectedPracticeGroup={setSelectedPracticeGroup}
        availableClients={availableClients}
        availablePracticeGroups={availablePracticeGroups}
        reportTypes={reportTypes}
        onGeneratePDF={onGeneratePDF}
        isGenerating={isGenerating}
        hasData={hasData}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {/* Report Data Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report Preview</CardTitle>
              <p className="text-sm text-gray-600">
                {currentReportType?.label} - Showing {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'}
                {dateRange?.from && dateRange?.to && (
                  <span className="ml-2">
                    from {dateRange.from.toLocaleDateString()} to {dateRange.to.toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={onExportData} 
                disabled={isGenerating || !hasData}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              <Button 
                onClick={onGeneratePDF} 
                disabled={isGenerating || !hasData}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate PDF'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <>
              {reportType === 'client-performance' && (
                <ReportSummaryCards filteredData={filteredData} />
              )}
              <ReportDataTable 
                filteredData={filteredData} 
                reportType={reportType}
                dateRange={dateRange}
              />
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No data matches the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Summary Section */}
      {filteredData.length > 0 && (
        <ReportSummarySection 
          filteredData={filteredData}
          reportType={reportType}
          selectedClient={selectedClient}
          dateRange={dateRange}
        />
      )}
    </div>
  );
};

export default ReportPreview;
