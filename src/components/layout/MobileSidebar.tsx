
import { Link, useLocation } from 'react-router-dom';
import { X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { NavigationGroup } from '@/config/navigation';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigationGroups: NavigationGroup[];
}

const MobileSidebar = ({ isOpen, onClose, navigationGroups }: MobileSidebarProps) => {
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

          <nav className="flex-1 px-2 py-4 space-y-4">
            {navigationGroups.map((group) => (
              <div key={group.name} className="space-y-1">
                <div className="flex items-center gap-2 px-3 mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.name}
                  </h3>
                  {group.subscriptionRequired && (
                    <Badge variant="secondary" className="text-xs">
                      {group.subscriptionRequired}
                    </Badge>
                  )}
                </div>
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={onClose}
                      title={item.description}
                    >
                      <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {item.subscriptionRequired && (
                        <Badge variant="outline" className="text-xs ml-2">
                          {item.subscriptionRequired}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
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
