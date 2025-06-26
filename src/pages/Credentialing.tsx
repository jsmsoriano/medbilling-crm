
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DoctorsList from '@/components/credentialing/DoctorsList';
import ApplicationsList from '@/components/credentialing/ApplicationsList';
import CredentialingDashboard from '@/components/credentialing/CredentialingDashboard';
import AddDoctorDialog from '@/components/credentialing/AddDoctorDialog';
import AddApplicationDialog from '@/components/credentialing/AddApplicationDialog';

const Credentialing = () => {
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddApplication, setShowAddApplication] = useState(false);

  const { data: doctors, isLoading: loadingDoctors, refetch: refetchDoctors } = useQuery({
    queryKey: ['credentialing-doctors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credentialing_doctors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: applications, isLoading: loadingApplications, refetch: refetchApplications } = useQuery({
    queryKey: ['credentialing-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('credentialing_applications')
        .select(`
          *,
          credentialing_doctors (
            first_name,
            last_name,
            specialty
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credentialing Management</h1>
          <p className="text-muted-foreground">
            Manage doctor credentialing applications and track progress
          </p>
        </div>
      </div>

      <CredentialingDashboard applications={applications || []} />

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Credentialing Applications</h2>
            <Button onClick={() => setShowAddApplication(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>
          <ApplicationsList 
            applications={applications || []} 
            loading={loadingApplications}
            onRefresh={refetchApplications}
          />
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Doctors</h2>
            <Button onClick={() => setShowAddDoctor(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </div>
          <DoctorsList 
            doctors={doctors || []} 
            loading={loadingDoctors}
            onRefresh={refetchDoctors}
          />
        </TabsContent>
      </Tabs>

      <AddDoctorDialog 
        open={showAddDoctor} 
        onOpenChange={setShowAddDoctor}
        onSuccess={() => {
          refetchDoctors();
          setShowAddDoctor(false);
        }}
      />

      <AddApplicationDialog 
        open={showAddApplication} 
        onOpenChange={setShowAddApplication}
        doctors={doctors || []}
        onSuccess={() => {
          refetchApplications();
          setShowAddApplication(false);
        }}
      />
    </div>
  );
};

export default Credentialing;
