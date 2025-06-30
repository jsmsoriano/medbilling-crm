
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Edit, MoreHorizontal, Filter, Calendar, Building } from 'lucide-react';
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

interface MobileApplicationsListProps {
  applications: Application[];
  loading: boolean;
  onRefresh: () => void;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
}

const MobileApplicationsList = ({ 
  applications, 
  loading, 
  onRefresh, 
  statusFilter = 'all',
  onStatusFilterChange 
}: MobileApplicationsListProps) => {
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

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending_documents', label: 'Pending Documents' },
    { value: 'documents_complete', label: 'Documents Complete' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'denied', label: 'Denied' }
  ];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-8">Loading applications...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-3">
            <CardTitle className="text-lg">Applications</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select 
                value={statusFilter} 
                onValueChange={onStatusFilterChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500 px-4">
              No applications found. Create your first application to get started.
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {applications.map((application) => (
                <Card key={application.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Doctor Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {application.credentialing_doctors 
                            ? `${application.credentialing_doctors.first_name} ${application.credentialing_doctors.last_name}`
                            : 'Unknown Doctor'
                          }
                        </h4>
                        <p className="text-xs text-gray-500">
                          {application.credentialing_doctors?.specialty}
                        </p>
                      </div>

                      {/* Insurance Company */}
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700 truncate">
                          {application.insurance_company}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {format(new Date(application.application_date), 'MMM dd, yyyy')}
                        </span>
                      </div>

                      {/* Status and Priority */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`${getStatusColor(application.status)} text-xs`}>
                          {application.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={`${getPriorityColor(application.priority)} text-xs`}>
                          {application.priority.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditApplication(application)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

export default MobileApplicationsList;
