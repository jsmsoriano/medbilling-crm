
import { Link, useLocation } from 'react-router-dom';
import { X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
}

const MobileSidebar = ({ isOpen, onClose, navigation }: MobileSidebarProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
      <div className="relative flex w-full max-w-xs flex-col bg-white h-full">
        <div className="absolute right-0 top-0 -mr-12 pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
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
              className="h-10 w-auto"
            />
          </div>
          
          {/* Mobile account info */}
          <div className="px-4 py-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-gray-600" />
              <div>
                <div className="font-medium text-gray-900">{user?.email || 'User'}</div>
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
                  onClick={onClose}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile sign out button */}
          <div className="px-4 py-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full justify-start mb-3"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
            
            {/* Version number */}
            <div className="text-xs text-gray-500 text-center">
              Version 1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
