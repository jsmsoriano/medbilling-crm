
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';

const ReportsHeader = () => {
  const handleDateRangeClick = () => {
    console.log('Date range filter clicked');
    // TODO: Implement date range picker functionality
  };

  const handleExportClick = () => {
    console.log('Export data clicked');
    // TODO: Implement data export functionality
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Track KPIs, analyze performance trends, and generate professional reports
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button 
          variant="outline" 
          onClick={handleDateRangeClick}
          className="w-full sm:w-auto"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
        <Button 
          variant="outline"
          onClick={handleExportClick}
          className="w-full sm:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default ReportsHeader;
