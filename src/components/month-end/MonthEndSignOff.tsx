import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertTriangle, FileCheck, User } from 'lucide-react';

interface MonthEndSignOffProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOff: (data: { signedBy: string; notes: string }) => void;
  isLoading: boolean;
}

const MonthEndSignOff = ({ isOpen, onClose, onSignOff, isLoading }: MonthEndSignOffProps) => {
  const [formData, setFormData] = useState({
    signedBy: '',
    notes: '',
    confirmation: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.signedBy.trim()) {
      return;
    }
    
    if (!formData.confirmation) {
      return;
    }
    
    onSignOff({
      signedBy: formData.signedBy,
      notes: formData.notes
    });
  };

  const handleClose = () => {
    setFormData({ signedBy: '', notes: '', confirmation: false });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5" />
            Month-End Sign-Off
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">Important Notice</p>
                <p>
                  Closing this month-end period will lock all claims and payments data for this month. 
                  Any future changes will be logged in the audit trail.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="signedBy" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Authorized Manager Name *
              </Label>
              <Input
                id="signedBy"
                value={formData.signedBy}
                onChange={(e) => setFormData(prev => ({ ...prev, signedBy: e.target.value }))}
                placeholder="Enter your full name"
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Only AR Managers and Admins are authorized to close month-end periods.
              </p>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes about this month-end close..."
                rows={3}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox
                id="confirmation"
                checked={formData.confirmation}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, confirmation: !!checked }))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="confirmation" className="text-sm font-medium">
                  I confirm that all checklist items have been completed
                </Label>
                <p className="text-xs text-gray-500">
                  I verify that all monthly billing tasks have been completed and this period is ready to close.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.signedBy.trim() || !formData.confirmation || isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Closing Month...' : 'Close Month'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MonthEndSignOff;