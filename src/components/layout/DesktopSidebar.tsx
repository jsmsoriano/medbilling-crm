
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavigationGroup } from '@/config/navigation';
import { Badge } from '@/components/ui/badge';

interface DesktopSidebarProps {
  navigationGroups: NavigationGroup[];
}

const DesktopSidebar = ({ navigationGroups }: DesktopSidebarProps) => {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:top-16 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 shadow-sm">
        <div className="flex flex-col flex-grow">
          <nav className="flex-1 px-4 py-6 space-y-6">
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
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      title={item.description}
                    >
                      <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
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
          
          {/* Version number at the bottom */}
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Version 1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
