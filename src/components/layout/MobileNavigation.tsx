
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
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

const MobileNavigation = () => {
  const location = useLocation();

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
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 truncate">Navigation</h2>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center px-3 py-4 text-base font-medium rounded-lg transition-colors min-h-[48px] touch-manipulation",
                isActive
                  ? "bg-blue-100 text-blue-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
              )}
            >
              <item.icon className="mr-4 h-6 w-6 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileNavigation;
