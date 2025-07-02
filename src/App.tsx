
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
import DataManagement from '@/pages/DataManagement';
import MobileDataManagement from '@/components/data-management/MobileDataManagement';
import MobileReports from '@/components/reports/MobileReports';
import Credentialing from '@/pages/Credentialing';
import Clients from '@/pages/Clients';
import Pipeline from '@/pages/Pipeline';
import Tasks from '@/pages/Tasks';
import TeamDashboard from '@/pages/TeamDashboard';
import FileVault from '@/pages/FileVault';
import Claims from '@/pages/Claims';
import MonthEndClose from '@/pages/MonthEndClose';
import Settings from '@/pages/Settings';
import MobileSettings from '@/components/settings/MobileSettings';
import Auth from '@/pages/Auth';
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
      <ThemeProvider>
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
                  path="reports" 
                  element={<MobileRoute mobileComponent={MobileReports} desktopComponent={Reports} />} 
                />
                <Route 
                  path="data-management" 
                  element={<MobileRoute mobileComponent={MobileDataManagement} desktopComponent={DataManagement} />} 
                />
                <Route path="credentialing" element={<Credentialing />} />
                <Route path="clients" element={<Clients />} />
                <Route path="claims" element={<Claims />} />
                <Route path="pipeline" element={<Pipeline />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="month-end-close" element={<MonthEndClose />} />
                <Route path="team-dashboard" element={<TeamDashboard />} />
                <Route path="file-vault" element={<FileVault />} />
                <Route 
                  path="settings" 
                  element={<MobileRoute mobileComponent={MobileSettings} desktopComponent={Settings} />} 
                />
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
