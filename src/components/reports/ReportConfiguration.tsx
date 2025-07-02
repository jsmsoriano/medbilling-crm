
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Filter, Calendar as CalendarIcon, ChevronDown, Download } from 'lucide-react';
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
  onGeneratePDF,
  isGenerating,
  hasData,
  dateRange,
  setDateRange
}: ReportConfigurationProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const currentReportType = reportTypes.find(type => type.value === selectedReportType);

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-4 bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="w-4 h-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Report Configuration</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentReportType?.label || 'Select report type and filters'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={onGeneratePDF}
                disabled={isGenerating || !hasData}
                size="sm"
                className="hover-scale"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate PDF'}
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="hover-scale">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        </CardHeader>
        
        <CollapsibleContent className="animate-accordion-down">
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Report Type</Label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="hover:bg-muted">
                        <div className="flex items-center gap-3">
                          <type.icon className="w-4 h-4 text-muted-foreground" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Client</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="All clients" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="all-clients" className="hover:bg-muted">All clients</SelectItem>
                    {availableClients.map((client) => (
                      <SelectItem key={client} value={client} className="hover:bg-muted">
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Practice Group</Label>
                <Select value={selectedPracticeGroup} onValueChange={setSelectedPracticeGroup}>
                  <SelectTrigger className="w-full h-11">
                    <SelectValue placeholder="All practice groups" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg">
                    <SelectItem value="all-groups" className="hover:bg-muted">All practice groups</SelectItem>
                    {availablePracticeGroups.map((group) => (
                      <SelectItem key={group} value={group} className="hover:bg-muted">
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full h-11 justify-start text-left font-normal hover-scale"
                    >
                      <CalendarIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <span className="truncate">
                            {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd, y")}
                          </span>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span className="text-muted-foreground">Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border shadow-lg" align="start">
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
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ReportConfiguration;
