import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NavigationGroup } from '@/config/navigation';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import logoGradient from '@/assets/logo-gradient.png';

interface DesktopSidebarProps {
  navigationGroups: NavigationGroup[];
}

const DesktopSidebar = ({ navigationGroups }: DesktopSidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => {
    // Check if manually expanded
    if (expandedItems.includes(itemName)) return true;
    
    // Auto-expand if this group contains the active route
    const group = navigationGroups.flatMap(g => g.items).find(item => item.name === itemName);
    if (group && group.children) {
      return group.children.some(child => location.pathname === child.href);
    }
    
    return false;
  };

  return (
    <div className="flex flex-col h-screen bg-card border-r border-border shadow-sm w-full">
      {/* Logo Section */}
      <div className="flex items-center h-16 px-4 border-b border-border bg-white">
        <Link to="/" className="flex items-center gap-3 w-full">
          <img
            src={logoGradient}
            alt="Excel Medical Billing"
            className="h-8 w-8 flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-gray-900 truncate">Excel Medical Billing</span>
            <span className="text-xs text-muted-foreground">CRM Dashboard</span>
          </div>
        </Link>
      </div>

      <div className="flex flex-col flex-grow overflow-hidden">
        <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto overflow-x-hidden">
          {navigationGroups.map((group) => (
            <div key={group.name} className="space-y-1">
              <div className="flex items-center gap-2 px-3 mb-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                  {group.name}
                </h3>
                {group.subscriptionRequired && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {group.subscriptionRequired}
                  </Badge>
                )}
              </div>
              {group.items.map((item) => {
                const isActive = location.pathname === item.href;
                const hasChildren = item.children && item.children.length > 0;
                const isChildActive = hasChildren && item.children?.some(child => 
                  location.pathname === child.href || 
                  (child.href !== item.href && location.pathname.startsWith(child.href))
                );
                const isItemOrChildActive = isActive || isChildActive;
                const isItemExpanded = isExpanded(item.name);
                
                return (
                  <div key={item.href} className="space-y-1">
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpanded(item.name)}
                        className={cn(
                          "group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full min-w-0",
                          isItemOrChildActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-foreground hover:bg-muted hover:text-primary"
                        )}
                        title={item.description}
                      >
                        <div className="flex items-center min-w-0 flex-1">
                          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                          <span className="flex-1 text-left truncate">{item.name}</span>
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
                          "group flex items-center rounded-lg transition-all duration-200 min-w-0 justify-start px-3 py-3",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-foreground hover:bg-muted hover:text-primary"
                        )}
                        title={item.description}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0 mr-3" />
                        <span className="flex-1 text-left truncate text-sm font-medium">{item.name}</span>
                        {item.subscriptionRequired && (
                          <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
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
                                "group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 w-full min-w-0",
                                isChildActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                              title={child.description}
                            >
                              <child.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                              <span className="flex-1 text-left truncate">{child.name}</span>
                              {child.subscriptionRequired && (
                                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
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
        
        {/* Version number at the bottom */}
        <div className="px-4 py-3 border-t border-border bg-muted/30 flex-shrink-0">
          <div className="text-xs text-muted-foreground text-center">
            Version 1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;