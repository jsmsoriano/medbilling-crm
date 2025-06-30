import './App.css';
import { ThemeProvider } from '@/components/ui/theme-provider';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileLayout from '@/components/layout/MobileLayout';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
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
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const MobileRoute = ({ mobileComponent: MobileComponent, desktopComponent: DesktopComponent, ...props }: any) => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileComponent {...props} /> : <DesktopComponent {...props} />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
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
              <Route path="pipeline" element={<Pipeline />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="team-dashboard" element={<TeamDashboard />} />
              <Route path="file-vault" element={<FileVault />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
