
import './App.css';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/hooks/useAuth';
import { SubscriptionProvider } from '@/hooks/useSubscription';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from '@/components/layout/MobileLayout';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import MobileDashboard from '@/components/dashboard/MobileDashboard';
import Reports from '@/pages/Reports';
import ARDashboard from '@/pages/ARDashboard';
import DataManagement from '@/pages/DataManagement';
import MobileDataManagement from '@/components/data-management/MobileDataManagement';
import MobileReports from '@/components/reports/MobileReports';
import Credentialing from '@/pages/Credentialing';
import CredentialingRenewals from '@/pages/CredentialingRenewals';
import Clients from '@/pages/Clients';
import ClientInsurance from '@/pages/ClientInsurance';
import Pipeline from '@/pages/Pipeline';
import PipelineLeads from '@/pages/PipelineLeads';
import PipelineDeals from '@/pages/PipelineDeals';
import PipelineTasks from '@/pages/PipelineTasks';
import PipelineReports from '@/pages/PipelineReports';
import Tasks from '@/pages/Tasks';
import MyTasks from '@/pages/MyTasks';
import TeamDashboard from '@/pages/TeamDashboard';
import FileVault from '@/pages/FileVault';
import FileVaultUpload from '@/pages/FileVaultUpload';
import Claims from '@/pages/Claims';
import ClaimsDenials from '@/pages/ClaimsDenials';
import PaymentPosting from '@/pages/PaymentPosting';
import PaymentERA from '@/pages/PaymentERA';
import PaymentReconciliation from '@/pages/PaymentReconciliation';
import MonthEndClose from '@/pages/MonthEndClose';
import Settings from '@/pages/Settings';
import MobileSettings from '@/components/settings/MobileSettings';
import Auth from '@/pages/Auth';
import AdminSubscriptionManager from '@/pages/AdminSubscriptionManager';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const MobileRoute = ({ mobileComponent: MobileComponent, desktopComponent: DesktopComponent, ...props }: any) => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileComponent {...props} /> : <DesktopComponent {...props} />;
};

function App() {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <SubscriptionProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/" element={isMobile ? <MobileLayout /> : <Layout />}>
                <Route 
                  index 
                  element={<MobileRoute mobileComponent={MobileDashboard} desktopComponent={Dashboard} />} 
                />
                <Route 
                  path="dashboard" 
                  element={<MobileRoute mobileComponent={MobileDashboard} desktopComponent={Dashboard} />} 
                />
                <Route 
                  path="reports" 
                  element={<MobileRoute mobileComponent={MobileReports} desktopComponent={Reports} />} 
                />
                <Route path="reports/ar-dashboard" element={<ARDashboard />} />
                <Route path="reports/aging" element={<ARDashboard />} />
                <Route path="reports/claims-status" element={<Reports />} />
                <Route path="reports/denials" element={<Reports />} />
                <Route path="reports/payments" element={<Reports />} />
                <Route 
                  path="data-management" 
                  element={<MobileRoute mobileComponent={MobileDataManagement} desktopComponent={DataManagement} />} 
                />
                {/* Client & Provider Routes */}
                <Route path="clients" element={<Clients />} />
                <Route path="clients/insurance" element={<ClientInsurance />} />
                
                {/* Claims Routes */}
                <Route path="claims" element={<Claims />} />
                <Route path="claims/denials" element={<ClaimsDenials />} />
                
                {/* Payment Routes */}
                <Route path="payments/posting" element={<PaymentPosting />} />
                <Route path="payments/era" element={<PaymentERA />} />
                <Route path="payments/reconciliation" element={<PaymentReconciliation />} />
                
                {/* Tasks Routes */}
                <Route path="tasks" element={<Tasks />} />
                <Route path="tasks/my-tasks" element={<MyTasks />} />
                
                {/* Credentialing Routes */}
                <Route path="credentialing" element={<Credentialing />} />
                <Route path="credentialing/renewals" element={<CredentialingRenewals />} />
                
                {/* File Vault Routes */}
                <Route path="file-vault" element={<FileVault />} />
                <Route path="file-vault/upload" element={<FileVaultUpload />} />
                
                {/* Pipeline/Sales Routes */}
                <Route path="pipeline" element={<Pipeline />} />
                <Route path="pipeline/leads" element={<PipelineLeads />} />
                <Route path="pipeline/deals" element={<PipelineDeals />} />
                <Route path="pipeline/tasks" element={<PipelineTasks />} />
                <Route path="pipeline/reports" element={<PipelineReports />} />
                
                {/* Other Routes */}
                <Route path="month-end-close" element={<MonthEndClose />} />
                <Route path="team-dashboard" element={<TeamDashboard />} />
                  <Route 
                    path="settings" 
                    element={<MobileRoute mobileComponent={MobileSettings} desktopComponent={Settings} />} 
                  />
                  <Route path="admin/subscriptions" element={<AdminSubscriptionManager />} />
                  <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
                <Toaster />
              </div>
            </Router>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
