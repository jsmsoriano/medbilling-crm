
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import { Download, FileText, Calendar as CalendarIcon, Filter, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const Reports = () => {
  const { clients, claims, loading } = useSpreadsheetData();
  const [selectedReportType, setSelectedReportType] = useState('client-performance');
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedPracticeGroup, setSelectedPracticeGroup] = useState('');
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { value: 'client-performance', label: 'Client Performance Report', icon: BarChart3 },
    { value: 'revenue-analysis', label: 'Revenue Analysis Report', icon: FileText },
    { value: 'claims-management', label: 'Claims Management Report', icon: FileText },
  ];

  // Mock data for demo - replace with real data processing
  const mockClientPerformance = [
    { name: 'Metro Medical', revenue: 15420, claims: 45, denialRate: 3.2, satisfaction: 98, practiceGroup: 'Primary Care' },
    { name: 'Sunrise Family', revenue: 12340, claims: 38, denialRate: 4.1, satisfaction: 95, practiceGroup: 'Family Medicine' },
    { name: 'Downtown Cardio', revenue: 9850, claims: 29, denialRate: 6.8, satisfaction: 92, practiceGroup: 'Cardiology' },
    { name: 'Pediatric Assoc', revenue: 8720, claims: 31, denialRate: 2.9, satisfaction: 99, practiceGroup: 'Pediatrics' },
  ];

  const availableClients = Array.from(new Set([...clients.map(c => c.clientName), ...mockClientPerformance.map(c => c.name)]));
  const availablePracticeGroups = Array.from(new Set(mockClientPerformance.map(c => c.practiceGroup)));

  const filteredData = useMemo(() => {
    let data = mockClientPerformance;
    
    if (selectedClient) {
      data = data.filter(item => item.name === selectedClient);
    }
    
    if (selectedPracticeGroup) {
      data = data.filter(item => item.practiceGroup === selectedPracticeGroup);
    }
    
    return data;
  }, [selectedClient, selectedPracticeGroup]);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(44, 82, 130);
      doc.text('Medical Billing Report', 20, 25);
      
      // Report details
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const reportTypeLabel = reportTypes.find(rt => rt.value === selectedReportType)?.label || '';
      doc.text(`Report Type: ${reportTypeLabel}`, 20, 40);
      doc.text(`Generated: ${format(new Date(), 'PPP')}`, 20, 50);
      
      if (selectedClient) {
        doc.text(`Client: ${selectedClient}`, 20, 60);
      }
      
      if (selectedPracticeGroup) {
        doc.text(`Practice Group: ${selectedPracticeGroup}`, 20, 70);
      }

      // Summary metrics
      let yPosition = selectedClient || selectedPracticeGroup ? 85 : 75;
      
      doc.setFontSize(16);
      doc.setTextColor(44, 82, 130);
      doc.text('Executive Summary', 20, yPosition);
      
      yPosition += 15;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      const totalRevenue = filteredData.reduce((sum, client) => sum + client.revenue, 0);
      const totalClaims = filteredData.reduce((sum, client) => sum + client.claims, 0);
      const avgDenialRate = filteredData.length > 0 ? 
        (filteredData.reduce((sum, client) => sum + client.denialRate, 0) / filteredData.length).toFixed(1) : '0';
      const avgSatisfaction = filteredData.length > 0 ? 
        (filteredData.reduce((sum, client) => sum + client.satisfaction, 0) / filteredData.length).toFixed(1) : '0';

      doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 20, yPosition);
      doc.text(`Total Claims: ${totalClaims}`, 20, yPosition + 10);
      doc.text(`Average Denial Rate: ${avgDenialRate}%`, 20, yPosition + 20);
      doc.text(`Average Satisfaction: ${avgSatisfaction}%`, 20, yPosition + 30);

      // Data table
      yPosition += 50;
      
      if (selectedReportType === 'client-performance') {
        doc.autoTable({
          startY: yPosition,
          head: [['Client', 'Revenue', 'Claims', 'Denial Rate', 'Satisfaction', 'Practice Group']],
          body: filteredData.map(client => [
            client.name,
            `$${client.revenue.toLocaleString()}`,
            client.claims.toString(),
            `${client.denialRate}%`,
            `${client.satisfaction}%`,
            client.practiceGroup
          ]),
          styles: { fontSize: 10 },
          headStyles: { fillColor: [44, 82, 130] },
          alternateRowStyles: { fillColor: [245, 247, 250] }
        });
      }

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
        doc.text('Generated by Medical Billing Dashboard', 20, doc.internal.pageSize.height - 10);
      }

      // Save the PDF
      const fileName = `${reportTypeLabel.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate comprehensive reports with advanced filtering and PDF export</p>
        </div>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Client Filter</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="All clients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All clients</SelectItem>
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
                <SelectTrigger>
                  <SelectValue placeholder="All practice groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All practice groups</SelectItem>
                  {availablePracticeGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <Button 
                onClick={generatePDF} 
                disabled={isGenerating || filteredData.length === 0}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Export PDF'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
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
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-sm text-gray-600">Total Revenue</div>
                  <div className="text-2xl font-bold">
                    ${filteredData.reduce((sum, client) => sum + client.revenue, 0).toLocaleString()}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600">Total Claims</div>
                  <div className="text-2xl font-bold">
                    {filteredData.reduce((sum, client) => sum + client.claims, 0)}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600">Avg Denial Rate</div>
                  <div className="text-2xl font-bold">
                    {(filteredData.reduce((sum, client) => sum + client.denialRate, 0) / filteredData.length).toFixed(1)}%
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-gray-600">Avg Satisfaction</div>
                  <div className="text-2xl font-bold">
                    {(filteredData.reduce((sum, client) => sum + client.satisfaction, 0) / filteredData.length).toFixed(1)}%
                  </div>
                </Card>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-2 text-left">Client</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Practice Group</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Revenue</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Claims</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Denial Rate</th>
                      <th className="border border-gray-200 px-4 py-2 text-left">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((client, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-2 font-medium">{client.name}</td>
                        <td className="border border-gray-200 px-4 py-2">{client.practiceGroup}</td>
                        <td className="border border-gray-200 px-4 py-2">${client.revenue.toLocaleString()}</td>
                        <td className="border border-gray-200 px-4 py-2">{client.claims}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span className={`font-medium ${client.denialRate < 5 ? 'text-green-600' : client.denialRate < 7 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {client.denialRate}%
                          </span>
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span className="font-medium text-green-600">{client.satisfaction}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No data matches the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
