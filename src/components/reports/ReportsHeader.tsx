
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';

const ReportsHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Track KPIs, analyze performance trends, and generate professional reports</p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Date Range
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default ReportsHeader;
