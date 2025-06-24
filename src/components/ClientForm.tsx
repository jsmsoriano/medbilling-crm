
import { useState, useEffect } from 'react';
import { SpreadsheetData } from '@/services/spreadsheetService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: SpreadsheetData | null;
  onSave: (client: SpreadsheetData) => void;
}

const ClientForm = ({ open, onOpenChange, client, onSave }: ClientFormProps) => {
  const [formData, setFormData] = useState<Partial<SpreadsheetData>>({
    clientName: '',
    email: '',
    phone: '',
    status: 'Active',
    notes: '',
    value: 0,
    lastContact: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    } else {
      setFormData({
        clientName: '',
        email: '',
        phone: '',
        status: 'Active',
        notes: '',
        value: 0,
        lastContact: new Date().toISOString().split('T')[0],
      });
    }
  }, [client, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData: SpreadsheetData = {
      id: client?.id || Date.now().toString(),
      clientName: formData.clientName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      status: formData.status || 'Active',
      notes: formData.notes || '',
      value: formData.value || 0,
      lastContact: formData.lastContact || new Date().toISOString().split('T')[0],
    };

    onSave(clientData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? 'Edit Client' : 'Add New Client'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status || 'Active'}
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              value={formData.value || 0}
              onChange={(e) => setFormData(prev => ({ ...prev, value: Number(e.target.value) }))}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {client ? 'Update Client' : 'Add Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientForm;
