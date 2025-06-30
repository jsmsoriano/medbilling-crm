
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface Application {
  id: string;
  status: string;
  priority: string;
  insurance_company: string;
  application_date: string;
  credentialing_doctors?: {
    first_name: string;
    last_name: string;
    specialty: string;
  };
}

interface CredentialingDashboardProps {
  applications: Application[];
  onTileClick?: (filterType: string) => void;
}

const CredentialingDashboard = ({ applications, onTileClick }: CredentialingDashboardProps) => {
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const urgentApplications = applications.filter(app => app.priority === 'urgent').length;
  const completedApplications = applications.filter(app => app.status === 'approved').length;
  const pendingApplications = applications.filter(app => 
    ['pending_documents', 'documents_complete', 'submitted', 'under_review'].includes(app.status)
  ).length;

  const handleTileClick = (filterType: string) => {
    if (onTileClick) {
      onTileClick(filterType);
    }
  };

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow mobile-card"
        onClick={() => handleTileClick('all')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{applications.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Active applications
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow mobile-card"
        onClick={() => handleTileClick('pending')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{pendingApplications}</div>
          <p className="text-xs text-muted-foreground mt-1">
            In progress
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow mobile-card"
        onClick={() => handleTileClick('completed')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{completedApplications}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Approved
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow mobile-card col-span-2 lg:col-span-1"
        onClick={() => handleTileClick('urgent')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Urgent</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{urgentApplications}</div>
          <p className="text-xs text-muted-foreground mt-1">
            High priority
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialingDashboard;
