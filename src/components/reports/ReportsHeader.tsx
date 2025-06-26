
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Download } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

const ReportsHeader = () => {
  const [date, setDate] = useState<DateRange | undefined>();

  const handleDateRangeClick = () => {
    console.log('Date range selected:', date);
    // Date range functionality is now working with the calendar picker
  };

  const handleExportClick = () => {
    console.log('Exporting data...');
    
    // Create sample CSV data
    const csvData = [
      ['Client', 'Practice Group', 'Revenue', 'Claims', 'Denial Rate', 'Satisfaction'],
      ['Metro Medical', 'Primary Care', '$15,420', '45', '3.2%', '98%'],
      ['Sunrise Family', 'Family Medicine', '$12,340', '38', '4.1%', '95%'],
      ['Downtown Cardio', 'Cardiology', '$9,850', '29', '6.8%', '92%'],
      ['Pediatric Assoc', 'Pediatrics', '$8,720', '31', '2.9%', '99%']
    ];
    
    // Convert to CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');
    
    // Create and download the file
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reports_data_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                "Date Range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="end">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
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
