
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, User, Building, FileText, AlertCircle } from 'lucide-react';

interface Application {
  id: string;
  status: string;
  priority: string;
  insurance_company: string;
  application_date: string;
  submission_date?: string;
  approval_date?: string;
  expiry_date?: string;
  estimated_completion_days?: number;
  notes?: string;
  application_type: string;
  credentialing_doctors?: {
    id: string;
    first_name: string;
    last_name: string;
    specialty: string;
    npi_number: string;
    email: string;
    phone: string;
  };
}

interface EditApplicationDialogProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EditApplicationDialog = ({ application, isOpen, onClose, onSuccess }: EditApplicationDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Application>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData(application);
    }
  }, [application]);

  const statuses = [
    'pending_documents',
    'documents_complete', 
    'submitted',
    'under_review',
    'approved',
    'denied'
  ];

  const priorities = ['low', 'standard', 'high', 'urgent'];
  const applicationTypes = ['initial', 'revalidation', 'appeal'];

  const handleSave = async () => {
    if (!application?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('credentialing_applications')
        .update({
          status: formData.status,
          priority: formData.priority,
          insurance_company: formData.insurance_company,
          application_date: formData.application_date,
          submission_date: formData.submission_date || null,
          approval_date: formData.approval_date || null,
          expiry_date: formData.expiry_date || null,
          estimated_completion_days: formData.estimated_completion_days,
          notes: formData.notes,
          application_type: formData.application_type,
        })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: "Application updated",
        description: "Application details have been updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-purple-100 text-purple-800';
      case 'pending_documents': return 'bg-yellow-100 text-yellow-800';
      case 'documents_complete': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Edit Application - {application.credentialing_doctors?.first_name} {application.credentialing_doctors?.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Doctor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">
                    {application.credentialing_doctors?.first_name} {application.credentialing_doctors?.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Specialty</p>
                  <p className="font-medium">{application.credentialing_doctors?.specialty}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">NPI Number</p>
                  <p className="font-medium">{application.credentialing_doctors?.npi_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{application.credentialing_doctors?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance_company">Insurance Company</Label>
                  <Input
                    id="insurance_company"
                    value={formData.insurance_company || ''}
                    onChange={(e) => handleChange('insurance_company', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="application_type">Application Type</Label>
                  <Select
                    value={formData.application_type || ''}
                    onValueChange={(value) => handleChange('application_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {applicationTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status || ''}
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(status)}>
                              {status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority || ''}
                    onValueChange={(value) => handleChange('priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(priority)}>
                              {priority.toUpperCase()}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimated_completion_days">Estimated Completion Days</Label>
                <Input
                  id="estimated_completion_days"
                  type="number"
                  value={formData.estimated_completion_days || ''}
                  onChange={(e) => handleChange('estimated_completion_days', Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Important Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="application_date">Application Date</Label>
                  <Input
                    id="application_date"
                    type="date"
                    value={formData.application_date || ''}
                    onChange={(e) => handleChange('application_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="submission_date">Submission Date</Label>
                  <Input
                    id="submission_date"
                    type="date"
                    value={formData.submission_date || ''}
                    onChange={(e) => handleChange('submission_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="approval_date">Approval Date</Label>
                  <Input
                    id="approval_date"
                    type="date"
                    value={formData.approval_date || ''}
                    onChange={(e) => handleChange('approval_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date || ''}
                    onChange={(e) => handleChange('expiry_date', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Notes & Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Application Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this application..."
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditApplicationDialog;
