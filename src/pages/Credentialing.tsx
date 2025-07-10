import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import CredentialingDashboard from '@/components/credentialing/CredentialingDashboard';
import ApplicationsList from '@/components/credentialing/ApplicationsList';
import MobileApplicationsList from '@/components/credentialing/MobileApplicationsList';
import AddApplicationDialog from '@/components/credentialing/AddApplicationDialog';
import { toast } from 'sonner';

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

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty: string;
}

const Credentialing = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dashboardFilter, setDashboardFilter] = useState<string>('all');
  const isMobile = useIsMobile();

  // Fetch applications with doctor information
  const { data: applications = [], isLoading, refetch } = useQuery({
    queryKey: ['credentialing-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credentialing_applications')
        .select(`
          *,
          credentialing_doctors (
            id,
            first_name,
            last_name,
            specialty,
            npi_number,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to fetch applications');
        throw error;
      }

      return data as Application[];
    },
  });

  // Fetch doctors for the add dialog
  const { data: doctors = [] } = useQuery({
    queryKey: ['credentialing-doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credentialing_doctors')
        .select('id, first_name, last_name, specialty')
        .order('last_name');

      if (error) {
        console.error('Error fetching doctors:', error);
        throw error;
      }

      return data as Doctor[];
    },
  });

  const handleDashboardClick = (filterType: string) => {
    setDashboardFilter(filterType);
    switch (filterType) {
      case 'pending':
        setStatusFilter('pending_documents,documents_complete,submitted,under_review');
        break;
      case 'completed':
        setStatusFilter('approved');
        break;
      case 'urgent':
        // Filter by priority instead of status
        setStatusFilter('all');
        setDashboardFilter('urgent');
        break;
      default:
        setStatusFilter('all');
        setDashboardFilter('all');
    }
  };

  const getFilteredApplications = () => {
    let filtered = applications;

    // Apply status filter
    if (statusFilter !== 'all') {
      const statuses = statusFilter.split(',');
      filtered = filtered.filter(app => statuses.includes(app.status));
    }

    // Apply dashboard filter (for urgent priority)
    if (dashboardFilter === 'urgent') {
      filtered = filtered.filter(app => app.priority === 'urgent');
    }

    return filtered;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-full overflow-x-hidden">
      <div className="flex justify-between items-center">
        <div className="text-center w-full">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Provider Credentialing</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage provider credentials and insurance applications</p>
        </div>
      </div>
      
      <div onClick={() => handleDashboardClick('all')}>
        <CredentialingDashboard 
          applications={applications} 
          onTileClick={handleDashboardClick}
        />
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-semibold">Applications</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} className="mobile-button">
          <Plus className="h-4 w-4 mr-2" />
          {isMobile ? 'Add' : 'Add Application'}
        </Button>
      </div>

      {isMobile ? (
        <MobileApplicationsList
          applications={getFilteredApplications()}
          loading={isLoading}
          onRefresh={refetch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      ) : (
        <ApplicationsList
          applications={getFilteredApplications()}
          loading={isLoading}
          onRefresh={refetch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
      )}

      <AddApplicationDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        doctors={doctors}
        onSuccess={() => {
          refetch();
          setIsAddDialogOpen(false);
        }}
      />
    </div>
  );
};

export default Credentialing;
