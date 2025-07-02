import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Download, 
  FileText, 
  Loader2,
  CheckCircle2,
  Eye
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodId?: string;
  year: number;
  month: number;
}

interface ReportData {
  arAging: any[];
  claimsStatus: any[];
  denials: any[];
  payments: any[];
  productivity: any[];
}

const ReportPackModal = ({ isOpen, onClose, periodId, year, month }: ReportPackModalProps) => {
  const [selectedReports, setSelectedReports] = useState({
    arAging: true,
    claimsStatus: true,
    denials: true,
    payments: true,
    productivity: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reportTypes = [
    { key: 'arAging', label: 'AR Aging Report', description: 'Outstanding claims by aging buckets' },
    { key: 'claimsStatus', label: 'Claims Status Report', description: 'All claims with current status' },
    { key: 'denials', label: 'Denials Report', description: 'Denied claims requiring attention' },
    { key: 'payments', label: 'Payments Report', description: 'All payments and reconciliation status' },
    { key: 'productivity', label: 'Productivity Summary', description: 'Team performance metrics' }
  ];

  // Fetch report data
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['month-end-report-data', year, month],
    queryFn: async (): Promise<ReportData> => {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      
      // AR Aging data
      const { data: arAging } = await supabase
        .from('claims')
        .select(`
          claim_number,
          patient_name,
          amount,
          balance_due,
          days_outstanding,
          aging_bucket,
          clients(name)
        `)
        .gte('balance_due', 0.01)
        .order('days_outstanding', { ascending: false });
      
      // Claims status data
      const { data: claimsStatus } = await supabase
        .from('claims')
        .select(`
          claim_number,
          patient_name,
          amount,
          status,
          submission_date,
          service_date,
          clients(name)
        `)
        .gte('service_date', format(monthStart, 'yyyy-MM-dd'))
        .lte('service_date', format(monthEnd, 'yyyy-MM-dd'))
        .order('submission_date', { ascending: false });
      
      // Denials data
      const { data: denials } = await supabase
        .from('claims')
        .select(`
          claim_number,
          patient_name,
          amount,
          denial_reason,
          submission_date,
          clients(name)
        `)
        .eq('status', 'denied')
        .gte('service_date', format(monthStart, 'yyyy-MM-dd'))
        .lte('service_date', format(monthEnd, 'yyyy-MM-dd'));
      
      // Payments data
      const { data: payments } = await supabase
        .from('payments')
        .select(`
          payment_amount,
          payment_date,
          payment_method,
          reference_number,
          claims(claim_number, patient_name, clients(name))
        `)
        .gte('payment_date', format(monthStart, 'yyyy-MM-dd'))
        .lte('payment_date', format(monthEnd, 'yyyy-MM-dd'))
        .order('payment_date', { ascending: false });
      
      // Productivity data (simplified)
      const { data: productivity } = await supabase
        .from('claims')
        .select('status, clients(name)')
        .gte('service_date', format(monthStart, 'yyyy-MM-dd'))
        .lte('service_date', format(monthEnd, 'yyyy-MM-dd'));
      
      return {
        arAging: arAging || [],
        claimsStatus: claimsStatus || [],
        denials: denials || [],
        payments: payments || [],
        productivity: productivity || []
      };
    },
    enabled: isOpen
  });

  // Mark download complete mutation
  const markDownloadCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!periodId) return;
      
      const { error } = await supabase
        .from('month_end_checklist_items')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          completed_by: 'Current User'
        })
        .eq('period_id', periodId)
        .eq('item_name', 'Download reports');
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month-end-checklist'] });
    }
  });

  const generatePDF = async () => {
    if (!reportData) return;
    
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;
      
      // Title
      pdf.setFontSize(20);
      pdf.text(`Month-End Report Pack - ${format(new Date(year, month - 1), 'MMMM yyyy')}`, 20, yPosition);
      yPosition += 20;
      
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, yPosition);
      yPosition += 20;

      // AR Aging Report
      if (selectedReports.arAging && reportData.arAging.length > 0) {
        pdf.setFontSize(16);
        pdf.text('AR Aging Report', 20, yPosition);
        yPosition += 10;
        
        const arData = reportData.arAging.map(claim => [
          claim.claim_number,
          claim.patient_name,
          `$${claim.amount?.toFixed(2) || '0.00'}`,
          `$${claim.balance_due?.toFixed(2) || '0.00'}`,
          claim.days_outstanding?.toString() || '0',
          claim.aging_bucket || 'Current'
        ]);
        
        (pdf as any).autoTable({
          head: [['Claim #', 'Patient', 'Amount', 'Balance', 'Days', 'Bucket']],
          body: arData,
          startY: yPosition,
          styles: { fontSize: 8 }
        });
        
        yPosition = (pdf as any).lastAutoTable.finalY + 20;
        
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
      }

      // Claims Status Report
      if (selectedReports.claimsStatus && reportData.claimsStatus.length > 0) {
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(16);
        pdf.text('Claims Status Report', 20, yPosition);
        yPosition += 10;
        
        const claimsData = reportData.claimsStatus.map(claim => [
          claim.claim_number,
          claim.patient_name,
          claim.status,
          `$${claim.amount?.toFixed(2) || '0.00'}`,
          format(new Date(claim.service_date), 'MM/dd/yyyy')
        ]);
        
        (pdf as any).autoTable({
          head: [['Claim #', 'Patient', 'Status', 'Amount', 'Service Date']],
          body: claimsData,
          startY: yPosition,
          styles: { fontSize: 8 }
        });
        
        yPosition = (pdf as any).lastAutoTable.finalY + 20;
      }

      // Denials Report
      if (selectedReports.denials && reportData.denials.length > 0) {
        if (yPosition > 200) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(16);
        pdf.text('Denials Report', 20, yPosition);
        yPosition += 10;
        
        const denialsData = reportData.denials.map(claim => [
          claim.claim_number,
          claim.patient_name,
          `$${claim.amount?.toFixed(2) || '0.00'}`,
          claim.denial_reason || 'Not specified'
        ]);
        
        (pdf as any).autoTable({
          head: [['Claim #', 'Patient', 'Amount', 'Denial Reason']],
          body: denialsData,
          startY: yPosition,
          styles: { fontSize: 8 }
        });
        
        yPosition = (pdf as any).lastAutoTable.finalY + 20;
      }

      // Save PDF
      const fileName = `Month-End-Report-Pack-${year}-${month.toString().padStart(2, '0')}.pdf`;
      pdf.save(fileName);
      
      // Mark download as complete
      await markDownloadCompleteMutation.mutateAsync();
      
      toast({
        title: "Report Pack Generated",
        description: `${fileName} has been downloaded successfully.`,
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate report pack.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleReport = (reportKey: string) => {
    setSelectedReports(prev => ({
      ...prev,
      [reportKey]: !prev[reportKey as keyof typeof prev]
    }));
  };

  const selectedCount = Object.values(selectedReports).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Download Report Pack
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Select the reports to include in your month-end report pack for{' '}
            <span className="font-medium">
              {format(new Date(year, month - 1), 'MMMM yyyy')}
            </span>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Loading report data...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {reportTypes.map((report) => {
                const dataCount = reportData?.[report.key as keyof ReportData]?.length || 0;
                
                return (
                  <div key={report.key} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={selectedReports[report.key as keyof typeof selectedReports]}
                      onCheckedChange={() => toggleReport(report.key)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Label className="font-medium">{report.label}</Label>
                        <Badge variant="secondary" className="text-xs">
                          {dataCount} records
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              {selectedCount} report{selectedCount !== 1 ? 's' : ''} selected
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={generatePDF}
                disabled={selectedCount === 0 || isGenerating || isLoading}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPackModal;