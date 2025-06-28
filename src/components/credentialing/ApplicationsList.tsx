import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Eye, Edit, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import EditApplicationDialog from './EditApplicationDialog';

interface Application {
  id: string;
  status: string;
  priority: string;
  insurance_company: string;
  application_date: string;
  submission_date?: string;
  approval_date?: string;
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

interface ApplicationsListProps {
  applications: Application[];
  loading: boolean;
  onRefresh: () => void;
}

const ApplicationsList = ({ applications, loading, onRefresh }: ApplicationsListProps) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditApplication = (application: Application) => {
    setSelectedApplication(application);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    onRefresh();
    setIsEditDialogOpen(false);
    setSelectedApplication(null);
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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading applications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Applications Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Doctor</TableHead>
                <TableHead>Insurance Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {application.credentialing_doctors 
                          ? `${application.credentialing_doctors.first_name} ${application.credentialing_doctors.last_name}`
                          : 'Unknown Doctor'
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {application.credentialing_doctors?.specialty}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.insurance_company}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(application.priority)}>
                      {application.priority.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.application_date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditApplication(application)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {applications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No applications found. Create your first application to get started.
            </div>
          )}
        </CardContent>
      </Card>

      <EditApplicationDialog
        application={selectedApplication}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
};

export default ApplicationsList;
