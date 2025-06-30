
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Filter, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface ReportType {
  value: string;
  label: string;
  icon: any;
}

interface ReportConfigurationProps {
  selectedReportType: string;
  setSelectedReportType: (value: string) => void;
  selectedClient: string;
  setSelectedClient: (value: string) => void;
  selectedPracticeGroup: string;
  setSelectedPracticeGroup: (value: string) => void;
  availableClients: string[];
  availablePracticeGroups: string[];
  reportTypes: ReportType[];
  onGeneratePDF: () => void;
  isGenerating: boolean;
  hasData: boolean;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const ReportConfiguration = ({
  selectedReportType,
  setSelectedReportType,
  selectedClient,
  setSelectedClient,
  selectedPracticeGroup,
  setSelectedPracticeGroup,
  availableClients,
  availablePracticeGroups,
  reportTypes,
  dateRange,
  setDateRange
}: ReportConfigurationProps) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Report Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={selectedReportType} onValueChange={setSelectedReportType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      <span className="truncate">{type.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Client Filter</Label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All clients" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all-clients">All clients</SelectItem>
                {availableClients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Practice Group</Label>
            <Select value={selectedPracticeGroup} onValueChange={setSelectedPracticeGroup}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All practice groups" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all-groups">All practice groups</SelectItem>
                {availablePracticeGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-full justify-start text-left font-normal border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-3 py-2 text-sm rounded-md flex items-center">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Select date range"
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportConfiguration;
