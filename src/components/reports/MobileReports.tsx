
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, BarChart3 } from 'lucide-react';
import { useReportData } from '@/hooks/useReportData';
import { DateRange } from 'react-day-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MobileReports = () => {
  const [selectedReportType, setSelectedReportType] = useState('client-performance');
  const [selectedClient, setSelectedClient] = useState('all-clients');
  const [isGenerating, setIsGenerating] = useState(false);

  const { availableClients, getFilteredData } = useReportData();

  const reportTypes = [
    { value: 'client-performance', label: 'Client Performance' },
    { value: 'ar-aging', label: 'AR Aging Report' },
    { value: 'payment-collection-trend', label: 'Payment Collection' },
    { value: 'denials-report', label: 'Denials Report' },
  ];

  const filteredData = getFilteredData(
    selectedClient === 'all-clients' ? '' : selectedClient,
    ''
  );

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="text-left mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600 text-sm">Generate comprehensive billing reports</p>
      </div>

      <Tabs defaultValue="configure" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Report Type
                  </label>
                  <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Client
                  </label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-clients">All Clients</SelectItem>
                      {availableClients.map((client) => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={handleGeneratePDF}
                  disabled={isGenerating || filteredData.length === 0}
                  className="w-full flex items-center gap-2"
                  size="lg"
                >
                  <Download className="h-4 w-4" />
                  {isGenerating ? 'Generating...' : 'Generate PDF'}
                </Button>
                
                <Button 
                  variant="outline" 
                  disabled={filteredData.length === 0}
                  className="w-full flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5" />
                Report Preview
              </CardTitle>
              <p className="text-sm text-gray-600">
                {filteredData.length} {filteredData.length === 1 ? 'result' : 'results'} found
              </p>
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <div className="space-y-3">
                  {filteredData.slice(0, 5).map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <span className="text-sm font-semibold text-green-600">
                          ${item.totalRevenue?.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>Claims: {item.totalClaims}</div>
                        <div>Paid: {item.paidClaims}</div>
                      </div>
                    </div>
                  ))}
                  {filteredData.length > 5 && (
                    <p className="text-sm text-gray-500 text-center pt-2">
                      And {filteredData.length - 5} more...
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No data matches the selected filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MobileReports;
