
import { useState, useEffect } from 'react';
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
  // Enhanced fields for sales pipeline
  practiceName?: string;
  groupName?: string;
  practiceType?: string;
  numberOfProviders?: number;
  decisionMaker?: string;
  currentBillingPartner?: string;
  painPoints?: string;
  budget?: number;
  timeline?: string;
  referredBy?: string;
  territory?: string;
  priority?: string;
  lastActivity?: string;
  followUpReason?: string;
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

  useEffect(() => {
    setFormData(prospect);
  }, [prospect]);

  const stages = ['Prospects', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];
  const practiceTypes = ['Family Practice', 'Internal Medicine', 'Pediatrics', 'Cardiology', 'Dermatology', 'Orthopedics', 'Mental Health', 'Urgent Care', 'Other'];
  const sources = ['Website', 'Referral', 'Cold Outreach', 'LinkedIn', 'Trade Show', 'Advertisement', 'Partner', 'Other'];

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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Prospect' : 'Update Stage'} - {formData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {mode === 'stage' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Stage Update Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this stage update..."
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company/Practice Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="practiceName">Practice Name</Label>
                    <Input
                      id="practiceName"
                      value={formData.practiceName || ''}
                      onChange={(e) => handleChange('practiceName', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupName">Group/Organization Name</Label>
                    <Input
                      id="groupName"
                      value={formData.groupName || ''}
                      onChange={(e) => handleChange('groupName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="practiceType">Practice Type</Label>
                    <Select
                      value={formData.practiceType || ''}
                      onValueChange={(value) => handleChange('practiceType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select practice type" />
                      </SelectTrigger>
                      <SelectContent>
                        {practiceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact">Primary Contact</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => handleChange('contact', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decisionMaker">Decision Maker</Label>
                    <Input
                      id="decisionMaker"
                      value={formData.decisionMaker || ''}
                      onChange={(e) => handleChange('decisionMaker', e.target.value)}
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
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Business Details</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfProviders">Number of Providers</Label>
                    <Input
                      id="numberOfProviders"
                      type="number"
                      value={formData.numberOfProviders || ''}
                      onChange={(e) => handleChange('numberOfProviders', Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="value">Estimated Monthly Revenue ($)</Label>
                    <Input
                      id="value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleChange('value', Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range ($)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget || ''}
                      onChange={(e) => handleChange('budget', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentBillingPartner">Current Billing Partner</Label>
                    <Input
                      id="currentBillingPartner"
                      value={formData.currentBillingPartner || ''}
                      onChange={(e) => handleChange('currentBillingPartner', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Expected Decision Timeline</Label>
                    <Input
                      id="timeline"
                      value={formData.timeline || ''}
                      onChange={(e) => handleChange('timeline', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Sales Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Sales Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stage">Sales Stage</Label>
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
                    <Label htmlFor="source">Lead Source</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value) => handleChange('source', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority || 'Medium'}
                      onValueChange={(value) => handleChange('priority', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority}>
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referredBy">Referred By</Label>
                    <Input
                      id="referredBy"
                      value={formData.referredBy || ''}
                      onChange={(e) => handleChange('referredBy', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="territory">Territory/Region</Label>
                    <Input
                      id="territory"
                      value={formData.territory || ''}
                      onChange={(e) => handleChange('territory', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="painPoints">Pain Points & Challenges</Label>
                  <Textarea
                    id="painPoints"
                    placeholder="Describe their current challenges and pain points..."
                    value={formData.painPoints || ''}
                    onChange={(e) => handleChange('painPoints', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">General Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add general notes about this prospect..."
                    value={formData.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
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
