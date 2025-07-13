import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NavigationGroup } from '@/config/navigation';

interface MobileSidebarNavigationProps {
  navigationGroups: NavigationGroup[];
  onClose: () => void;
}

const MobileSidebarNavigation = ({ navigationGroups, onClose }: MobileSidebarNavigationProps) => {
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
            const isChildActive = hasChildren && item.children?.some(child => 
              location.pathname === child.href || 
              (child.href !== item.href && location.pathname.startsWith(child.href))
            );
            const isItemOrChildActive = isActive || isChildActive;
            const isItemExpanded = isExpanded(item.name);
            
            return (
              <div key={item.href} className="space-y-1">
                {hasChildren ? (
                  <div className="flex">
                    <Link
                      to={item.href}
                      className={cn(
                        "group flex items-center justify-start px-3 py-3 text-base font-medium rounded-l-lg transition-all duration-200 flex-1 min-w-0",
                        isItemOrChildActive
                          ? "nav-active-parent"
                          : "text-foreground hover:bg-muted hover:text-primary"
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
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        "flex items-center justify-center px-3 py-3 rounded-r-lg transition-all duration-200 border-l border-border/50",
                        isItemOrChildActive
                          ? "nav-active-parent"
                          : "text-foreground hover:bg-muted hover:text-primary"
                      )}
                      title={`Toggle ${item.name} submenu`}
                    >
                      {isItemExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ) : (
                    <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center justify-start px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 w-full",
                      isActive
                        ? "nav-active-parent"
                        : "text-foreground hover:bg-muted hover:text-primary"
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
                              ? "nav-active-child"
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
  );
};

export default MobileSidebarNavigation;