import { useEffect, useState } from 'react';
import { DollarSign, Eye, Plus, Calendar, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface Claim {
  id: string;
  claim_number: string;
  patient_name: string;
  client_id: string;
  amount: number;
  balance_due: number;
  status: string;
  aging_bucket: string;
  submission_date: string;
  payment_date?: string;
  insurance_company: string;
  days_outstanding: number;
}

interface ClaimsListProps {
  agingBucket: string;
  onPostPayment: (claimId: string) => void;
}

const ClaimsList = ({ agingBucket, onPostPayment }: ClaimsListProps) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClaims();
  }, [agingBucket]);

  const fetchClaims = async () => {
    try {
      let query = supabase.from('claims').select('*').order('submission_date', { ascending: false });
      
      if (agingBucket) {
        query = query.eq('aging_bucket', agingBucket);
      }

      const { data, error } = await query;
      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      submitted: 'bg-yellow-100 text-yellow-800',
      partially_paid: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      denied: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getAgingBadge = (bucket: string) => {
    const agingStyles = {
      '0-30': 'bg-green-100 text-green-800',
      '31-60': 'bg-yellow-100 text-yellow-800',
      '61-90': 'bg-orange-100 text-orange-800',
      '90+': 'bg-red-100 text-red-800',
    };

    return (
      <Badge className={agingStyles[bucket as keyof typeof agingStyles] || 'bg-gray-100 text-gray-800'}>
        {bucket} days
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!claims.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-medium mb-2">No claims found</h3>
        <p className="text-sm">No claims match the current filter</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Claim #</TableHead>
            <TableHead className="min-w-[150px]">Patient</TableHead>
            <TableHead className="min-w-[140px] hidden sm:table-cell">Insurance</TableHead>
            <TableHead className="min-w-[100px] text-right">Amount</TableHead>
            <TableHead className="min-w-[100px] text-right hidden md:table-cell">Balance Due</TableHead>
            <TableHead className="min-w-[80px]">Status</TableHead>
            <TableHead className="min-w-[80px] hidden lg:table-cell">Aging</TableHead>
            <TableHead className="min-w-[100px] hidden xl:table-cell">Submit Date</TableHead>
            <TableHead className="min-w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.map((claim) => (
            <TableRow key={claim.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <span className="truncate block max-w-[120px]" title={claim.claim_number}>
                  {claim.claim_number}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 min-w-0">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate max-w-[120px]" title={claim.patient_name}>
                    {claim.patient_name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span className="truncate block max-w-[130px]" title={claim.insurance_company}>
                  {claim.insurance_company}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="whitespace-nowrap font-medium">
                  ${claim.amount.toLocaleString()}
                </span>
              </TableCell>
              <TableCell className="text-right hidden md:table-cell">
                <span className="whitespace-nowrap font-medium">
                  ${claim.balance_due?.toLocaleString() || '0'}
                </span>
              </TableCell>
              <TableCell>{getStatusBadge(claim.status)}</TableCell>
              <TableCell className="hidden lg:table-cell">{getAgingBadge(claim.aging_bucket || '0-30')}</TableCell>
              <TableCell className="hidden xl:table-cell">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm whitespace-nowrap">
                    {format(new Date(claim.submission_date), 'MMM dd, yyyy')}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onPostPayment(claim.id)}
                  disabled={claim.status === 'paid'}
                  className="text-xs px-2 py-1 whitespace-nowrap"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">Payment</span>
                  <span className="sm:hidden">Pay</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClaimsList;