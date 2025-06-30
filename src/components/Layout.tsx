
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  FileText,
  Settings,
  Database,
  UserCheck,
  CheckSquare,
  UsersIcon,
  FolderOpen
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import LayoutHeader from './layout/LayoutHeader';
import MobileHeader from './layout/MobileHeader';
import MobileSidebar from './layout/MobileSidebar';
import DesktopSidebar from './layout/DesktopSidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Data Management', href: '/data-management', icon: Database },
    { name: 'Credentialing', href: '/credentialing', icon: UserCheck },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: TrendingUp },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Team Dashboard', href: '/team-dashboard', icon: UsersIcon },
    { name: 'File Vault', href: '/file-vault', icon: FolderOpen },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conditional headers based on device type */}
      {isMobile ? (
        <MobileHeader />
      ) : (
        <LayoutHeader onMobileMenuToggle={() => setSidebarOpen(true)} />
      )}
      
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={navigation}
      />

      {!isMobile && <DesktopSidebar navigation={navigation} />}

      {/* Main content - adjusted for mobile */}
      <div className={`pt-16 ${!isMobile ? 'lg:pl-64' : ''}`}>
        <main className={isMobile ? 'px-4 pb-4' : ''}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
