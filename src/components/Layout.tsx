
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  FileText,
  Settings,
  FileSpreadsheet,
  UserCheck
} from 'lucide-react';
import LayoutHeader from './layout/LayoutHeader';
import MobileSidebar from './layout/MobileSidebar';
import DesktopSidebar from './layout/DesktopSidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Spreadsheet Management', href: '/spreadsheet-management', icon: FileSpreadsheet },
    { name: 'Credentialing', href: '/credentialing', icon: UserCheck },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LayoutHeader onMobileMenuToggle={() => setSidebarOpen(true)} />
      
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
      />

      <DesktopSidebar navigation={navigation} />

      {/* Main content - adjusted for fixed header */}
      <div className="lg:pl-64 pt-16">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
