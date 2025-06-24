
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSpreadsheetData } from '@/hooks/useSpreadsheetData';
import { SpreadsheetData } from '@/services/spreadsheetService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar as CalendarIcon, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  type: 'meeting' | 'followup' | 'call';
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clients } = useSpreadsheetData();
  const { toast } = useToast();
  
  const [client, setClient] = useState<SpreadsheetData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<SpreadsheetData | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    title: '',
    date: new Date(),
    type: 'meeting',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    const foundClient = clients.find(c => c.id === id);
    if (foundClient) {
      setClient(foundClient);
      setEditedClient({ ...foundClient });
    }
  }, [id, clients]);

  const handleSaveClient = () => {
    if (editedClient) {
      setClient(editedClient);
      setIsEditing(false);
      toast({
        title: "Client updated",
        description: "Client information has been saved successfully",
      });
    }
  };

  const handleAddMeeting = () => {
    if (newMeeting.title && newMeeting.date) {
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        date: newMeeting.date,
        type: newMeeting.type as 'meeting' | 'followup' | 'call',
        notes: newMeeting.notes || '',
        status: 'scheduled'
      };
      setMeetings([...meetings, meeting]);
      setNewMeeting({
        title: '',
        date: new Date(),
        type: 'meeting',
        notes: '',
        status: 'scheduled'
      });
      setShowNewMeeting(false);
      toast({
        title: "Meeting scheduled",
        description: "New meeting has been added successfully",
      });
    }
  };

  const handleDeleteMeeting = (meetingId: string) => {
    setMeetings(meetings.filter(m => m.id !== meetingId));
    toast({
      title: "Meeting deleted",
      description: "Meeting has been removed successfully",
    });
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Client not found</p>
          <Button onClick={() => navigate('/clients')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{client.clientName}</h1>
        </div>
        <Button
          onClick={() => isEditing ? handleSaveClient() : setIsEditing(true)}
        >
          {isEditing ? 'Save Changes' : 'Edit Client'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      value={editedClient?.clientName || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, clientName: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedClient?.email || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, email: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedClient?.phone || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editedClient?.status || 'Active'}
                      onValueChange={(value) => setEditedClient(prev => prev ? { ...prev, status: value } : null)}
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
                      value={editedClient?.value || 0}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, value: Number(e.target.value) } : null)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editedClient?.notes || ''}
                      onChange={(e) => setEditedClient(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label>Email</Label>
                    <p className="text-gray-900">{client.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-gray-900">{client.phone}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className="ml-2">{client.status}</Badge>
                  </div>
                  <div>
                    <Label>Value</Label>
                    <p className="text-gray-900 font-semibold text-green-600">
                      ${client.value.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <Label>Last Contact</Label>
                    <p className="text-gray-900">{client.lastContact}</p>
                  </div>
                  {client.notes && (
                    <div>
                      <Label>Notes</Label>
                      <p className="text-gray-900">{client.notes}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Meetings & Follow-ups */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Meetings & Follow-ups</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setShowNewMeeting(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showNewMeeting && (
                <Card className="p-4 border-dashed">
                  <div className="space-y-3">
                    <Input
                      placeholder="Meeting title"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting(prev => ({ ...prev, title: e.target.value }))}
                    />
                    <Select
                      value={newMeeting.type}
                      onValueChange={(value) => setNewMeeting(prev => ({ ...prev, type: value as 'meeting' | 'followup' | 'call' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="followup">Follow-up</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                      </SelectContent>
                    </Select>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          {newMeeting.date ? format(newMeeting.date, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newMeeting.date}
                          onSelect={(date) => setNewMeeting(prev => ({ ...prev, date: date || new Date() }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Textarea
                      placeholder="Notes"
                      value={newMeeting.notes}
                      onChange={(e) => setNewMeeting(prev => ({ ...prev, notes: e.target.value }))}
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddMeeting} size="sm">Add</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewMeeting(false)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {meetings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No meetings scheduled</p>
              ) : (
                meetings.map((meeting) => (
                  <Card key={meeting.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{meeting.title}</h4>
                        <p className="text-sm text-gray-500 capitalize">{meeting.type}</p>
                        <p className="text-sm text-gray-500">{format(meeting.date, 'PPP')}</p>
                        {meeting.notes && (
                          <p className="text-sm text-gray-600 mt-1">{meeting.notes}</p>
                        )}
                        <Badge
                          className={`mt-2 ${
                            meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                            meeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {meeting.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
