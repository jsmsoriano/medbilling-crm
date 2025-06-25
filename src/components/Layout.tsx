
import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  BarChart3,
  FileText,
  Settings,
  Menu,
  X,
  Bell,
  User,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Spreadsheet Management', href: '/spreadsheet-management', icon: FileSpreadsheet },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Pipeline', href: '/pipeline', icon: TrendingUp },
    { name: 'Performance', href: '/performance', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Left side - Logo and Menu Button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/98e62fe8-89f3-4c17-82c9-a872ff6e2d36.png"
                alt="Excel Medical Billing"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Right side - Account, Notifications, Settings */}
          <div className="flex items-center gap-2">
            {/* Account info - hidden on mobile */}
            <div className="hidden md:flex items-center gap-3 mr-4 px-3 py-2 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-600" />
              <div className="text-sm">
                <div className="font-medium text-gray-900">John Doe</div>
                <div className="text-gray-500">Admin</div>
              </div>
            </div>
            
            {/* Notification Bell */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>
            
            {/* Settings */}
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile account menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex w-full max-w-xs flex-col bg-white h-full">
          <div className="absolute right-0 top-0 -mr-12 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col h-full">
            <div className="flex items-center px-4 py-6 border-b">
              <img
                src="/lovable-uploads/98e62fe8-89f3-4c17-82c9-a872ff6e2d36.png"
                alt="Excel Medical Billing"
                className="h-8 w-auto"
              />
            </div>
            
            {/* Mobile account info */}
            <div className="px-4 py-4 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-gray-600" />
                <div>
                  <div className="font-medium text-gray-900">John Doe</div>
                  <div className="text-sm text-gray-500">Admin</div>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-4 h-6 w-6" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:top-16 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
          <div className="flex flex-col flex-grow">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-0">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
