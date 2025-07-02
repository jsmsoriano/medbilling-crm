import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface PaymentPostingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claimId: string | null;
}

interface Claim {
  id: string;
  claim_number: string;
  patient_name: string;
  amount: number;
  balance_due: number;
  insurance_company: string;
}

interface Payment {
  id: string;
  payment_amount: number;
  payment_date: string;
  payment_method: string;
  reference_number: string;
}

const PaymentPostingDialog = ({ open, onOpenChange, claimId }: PaymentPostingDialogProps) => {
  const [claim, setClaim] = useState<Claim | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      payment_amount: '',
      payment_date: '',
      payment_method: 'check',
      reference_number: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open && claimId) {
      fetchClaim();
      fetchPayments();
      // Set payment date to today
      form.setValue('payment_date', new Date().toISOString().split('T')[0]);
    }
  }, [open, claimId, form]);

  const fetchClaim = async () => {
    if (!claimId) return;
    
    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('id', claimId)
        .single();
      
      if (error) throw error;
      setClaim(data);
    } catch (error) {
      console.error('Error fetching claim:', error);
    }
  };

  const fetchPayments = async () => {
    if (!claimId) return;
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('claim_id', claimId)
        .order('payment_date', { ascending: false });
      
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const onSubmit = async (data: any) => {
    if (!claimId) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.from('payments').insert({
        claim_id: claimId,
        payment_amount: parseFloat(data.payment_amount),
        payment_date: data.payment_date,
        payment_method: data.payment_method,
        reference_number: data.reference_number,
        notes: data.notes,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment posted successfully',
      });

      form.reset();
      fetchClaim(); // Refresh claim data
      fetchPayments(); // Refresh payments list
      // Don't close dialog, allow multiple payments
    } catch (error) {
      console.error('Error posting payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!claim) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Payment - {claim.claim_number}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Claim Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Claim Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient</p>
                  <p className="font-medium">{claim.patient_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                  <p className="font-medium">{claim.insurance_company}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Claim Amount</p>
                  <p className="font-medium">${claim.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Balance Due</p>
                  <p className="font-medium text-red-600">${claim.balance_due?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post New Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="payment_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Amount</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" placeholder="0.00" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payment_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Date</FormLabel>
                          <FormControl>
                            <Input {...field} type="date" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="payment_method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="check">Check</SelectItem>
                              <SelectItem value="eft">EFT</SelectItem>
                              <SelectItem value="credit_card">Credit Card</SelectItem>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reference_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reference Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Check #, transaction ID, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Additional notes..." rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Posting...' : 'Post Payment'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Payment History */}
          {payments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{format(new Date(payment.payment_date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell className="font-medium">${payment.payment_amount.toLocaleString()}</TableCell>
                        <TableCell className="capitalize">{payment.payment_method.replace('_', ' ')}</TableCell>
                        <TableCell>{payment.reference_number || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentPostingDialog;