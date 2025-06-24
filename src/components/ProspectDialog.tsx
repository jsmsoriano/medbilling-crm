
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export interface Prospect {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  stage: string;
  value: number;
  probability: number;
  nextAction: string;
  nextActionDate: string;
  lastContact: string;
  source: string;
  notes?: string;
}

interface ProspectDialogProps {
  prospect: Prospect | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (prospect: Prospect) => void;
  mode: 'edit' | 'stage';
}

const ProspectDialog = ({ prospect, isOpen, onClose, onSave, mode }: ProspectDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Prospect | null>(prospect);

  const stages = ['Prospects', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const handleSave = () => {
    if (!formData) return;

    onSave(formData);
    toast({
      title: mode === 'edit' ? 'Prospect updated' : 'Stage updated',
      description: `${formData.name} has been updated successfully.`,
    });
    onClose();
  };

  const handleChange = (field: keyof Prospect, value: string | number) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Prospect' : 'Update Stage'} - {formData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {mode === 'stage' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleChange('stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => handleChange('probability', Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextAction">Next Action</Label>
                <Input
                  id="nextAction"
                  value={formData.nextAction}
                  onChange={(e) => handleChange('nextAction', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextActionDate">Next Action Date</Label>
                <Input
                  id="nextActionDate"
                  type="date"
                  value={formData.nextActionDate}
                  onChange={(e) => handleChange('nextActionDate', e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Person</Label>
                  <Input
                    id="contact"
                    value={formData.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Deal Value ($)</Label>
                  <Input
                    id="value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleChange('value', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleChange('stage', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add notes about this prospect..."
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {mode === 'edit' ? 'Save Changes' : 'Update Stage'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProspectDialog;
