
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NavigationGroup } from '@/config/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, ChevronLeft, Menu } from 'lucide-react';
import { useSidebar } from '../Layout';

interface DesktopSidebarProps {
  navigationGroups: NavigationGroup[];
}

const DesktopSidebar = ({ navigationGroups }: DesktopSidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { isCollapsed, toggleSidebar } = useSidebar();
  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  return (
    <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:top-16 lg:left-0 lg:z-30 transition-all duration-300 ${sidebarWidth}`}>
      <div className="flex flex-col flex-grow bg-card border-r border-border shadow-sm overflow-hidden h-[calc(100vh-4rem)]">
        {/* Toggle Button */}
        <div className="flex items-center justify-end p-2 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex flex-col flex-grow h-full overflow-hidden">
          <nav className="flex-1 px-2 py-4 space-y-4 overflow-y-auto overflow-x-hidden">
            {navigationGroups.map((group) => (
              <div key={group.name} className="space-y-1">
                {!isCollapsed && (
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
                )}
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const hasChildren = item.children && item.children.length > 0;
                  const isItemExpanded = isExpanded(item.name);
                  
                  return (
                    <div key={item.href} className="space-y-1">
                      {hasChildren && !isCollapsed ? (
                        <button
                          onClick={() => toggleExpanded(item.name)}
                          className={cn(
                            "group flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full min-w-0",
                            isActive || item.children?.some(child => location.pathname === child.href)
                              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                              : "text-foreground hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm"
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
                            "group flex items-center rounded-lg transition-all duration-200 min-w-0",
                            isCollapsed ? "justify-center p-3" : "justify-start px-3 py-3",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "text-foreground hover:bg-muted hover:text-primary"
                          )}
                          title={item.description}
                        >
                          <item.icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left truncate text-sm font-medium">{item.name}</span>
                              {item.subscriptionRequired && (
                                <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                                  {item.subscriptionRequired}
                                </Badge>
                              )}
                            </>
                          )}
                        </Link>
                      )}
                      
                      {/* Submenu items - only show when not collapsed */}
                      {hasChildren && isItemExpanded && !isCollapsed && (
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
          
          {/* Version number at the bottom - only show when expanded */}
          {!isCollapsed && (
            <div className="px-4 py-3 border-t border-border bg-muted/30 flex-shrink-0">
              <div className="text-xs text-muted-foreground text-center">
                Version 1.0.0
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
