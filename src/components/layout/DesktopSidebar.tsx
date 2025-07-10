
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
    <div className="hidden lg:fixed lg:inset-y-0 lg:top-16 lg:flex lg:w-64 lg:flex-col lg:h-[calc(100vh-4rem)]">
      <div className="flex flex-col flex-grow bg-card border-r border-border shadow-sm">
        <div className="flex flex-col flex-grow h-full">
          <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto">
            {navigationGroups.map((group) => (
              <div key={group.name} className="space-y-1">
                <div className="flex items-center gap-2 px-3 mb-3">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
                        "group flex items-center justify-start px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full",
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                          : "text-foreground hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
                      )}
                      title={item.description}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.name}</span>
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
          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <div className="text-xs text-muted-foreground text-center">
              Version 1.0.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
