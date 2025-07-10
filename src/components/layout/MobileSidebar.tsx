
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { X, User, LogOut, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

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

          <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto">
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
                  const hasChildren = item.children && item.children.length > 0;
                  const isItemExpanded = isExpanded(item.name);
                  
                  return (
                    <div key={item.href} className="space-y-1">
                      {hasChildren ? (
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className={cn(
                            "group flex items-center justify-between px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 w-full",
                            isActive || item.children?.some(child => location.pathname === child.href)
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                              : "text-foreground hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
                          )}
                        >
                          <div className="flex items-center min-w-0 flex-1">
                            <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
                            <span className="flex-1 text-left">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.subscriptionRequired && (
                              <Badge variant="outline" className="text-xs">
                                {item.subscriptionRequired}
                              </Badge>
                            )}
                            {isItemExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>
                        </button>
                      ) : (
                        <Link
                          to={item.href}
                          className={cn(
                            "group flex items-center justify-start px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 w-full",
                            isActive
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                              : "text-foreground hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
                          )}
                          onClick={onClose}
                          title={item.description}
                        >
                          <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
                          <span className="flex-1 text-left">{item.name}</span>
                          {item.subscriptionRequired && (
                            <Badge variant="outline" className="text-xs ml-2">
                              {item.subscriptionRequired}
                            </Badge>
                          )}
                        </Link>
                      )}
                      
                      {/* Submenu items */}
                      {hasChildren && isItemExpanded && (
                        <div className="ml-6 space-y-1">
                          {item.children?.map((child) => {
                            const isChildActive = location.pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                to={child.href}
                                className={cn(
                                  "group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 w-full",
                                  isChildActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                                onClick={onClose}
                                title={child.description}
                              >
                                <child.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                                <span className="flex-1 text-left">{child.name}</span>
                                {child.subscriptionRequired && (
                                  <Badge variant="outline" className="text-xs ml-2">
                                    {child.subscriptionRequired}
                                  </Badge>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
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
