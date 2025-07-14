import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

  // Auto-expand based on current route
  useEffect(() => {
    const activeItem = navigationGroups
      .flatMap(g => g.items)
      .find(item => 
        item.children?.some(child => location.pathname === child.href)
      );
    
    if (activeItem && !expandedItems.includes(activeItem.name)) {
      setExpandedItems(prev => [...prev, activeItem.name]);
    }
  }, [location.pathname, navigationGroups, expandedItems]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isExpanded = (itemName: string) => {
    return expandedItems.includes(itemName);
  };

  return (
    <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto scrollbar-thin">
      {navigationGroups.map((group) => (
        <div key={group.name} className="space-y-2">
          <div className="flex items-center gap-2 px-2 mb-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em] truncate">
              {group.name}
            </h3>
            {group.subscriptionRequired && (
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 flex-shrink-0 bg-blue-50 text-blue-600 border-blue-200">
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
                  <div className="flex rounded-xl overflow-hidden bg-white/60 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md group">
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center px-4 py-4 flex-1 transition-all duration-300 min-w-0 relative",
                        isItemOrChildActive
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-50/80 hover:text-blue-600"
                      )}
                      onClick={onClose}
                      title={item.description}
                    >
                      <item.icon className={cn(
                        "h-5 w-5 flex-shrink-0 mr-4 transition-all duration-300",
                        isItemOrChildActive 
                          ? "text-white drop-shadow-sm" 
                          : "text-gray-500 group-hover:text-blue-500"
                      )} />
                      <span className="flex-1 text-left truncate text-sm font-medium">{item.name}</span>
                      {item.subscriptionRequired && (
                        <Badge variant="outline" className={cn(
                          "text-[10px] ml-2 flex-shrink-0 border transition-all duration-300",
                          isItemOrChildActive 
                            ? "bg-white/20 text-white border-white/30" 
                            : "bg-blue-50 text-blue-600 border-blue-200"
                        )}>
                          {item.subscriptionRequired}
                        </Badge>
                      )}
                    </Link>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        "flex items-center justify-center px-3 py-4 transition-all duration-300 border-l border-gray-200/60",
                        isItemOrChildActive
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "text-gray-500 hover:bg-gray-50/80 hover:text-blue-600"
                      )}
                      title={`Toggle ${item.name} submenu`}
                    >
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-all duration-300",
                        isItemExpanded ? "rotate-180" : "rotate-0"
                      )} />
                    </button>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "group flex items-center rounded-xl px-4 py-4 transition-all duration-300 min-w-0 bg-white/60 hover:bg-white/80 shadow-sm hover:shadow-md",
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                        : "text-gray-700 hover:text-blue-600"
                    )}
                    onClick={onClose}
                    title={item.description}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0 mr-4 transition-all duration-300",
                      isActive 
                        ? "text-white drop-shadow-sm" 
                        : "text-gray-500 group-hover:text-blue-500"
                    )} />
                    <span className="flex-1 text-left truncate text-sm font-medium">{item.name}</span>
                    {item.subscriptionRequired && (
                      <Badge variant="outline" className={cn(
                        "text-[10px] ml-2 flex-shrink-0 border transition-all duration-300",
                        isActive 
                          ? "bg-white/20 text-white border-white/30" 
                          : "bg-blue-50 text-blue-600 border-blue-200"
                      )}>
                        {item.subscriptionRequired}
                      </Badge>
                    )}
                  </Link>
                )}
                
                {/* Submenu items */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-out",
                  isItemExpanded 
                    ? "max-h-96 opacity-100 translate-y-0" 
                    : "max-h-0 opacity-0 -translate-y-2"
                )}>
                  {hasChildren && (
                    <div className="ml-6 mt-2 space-y-1 pb-2">
                      {item.children?.map((child) => {
                        const isChildActive = location.pathname === child.href || 
                          (child.href !== item.href && location.pathname.startsWith(child.href + '/'));
                        return (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={cn(
                              "group flex items-center px-3 py-3 text-sm rounded-lg transition-all duration-300 w-full min-w-0 bg-white/40 hover:bg-white/70 shadow-sm hover:shadow-md",
                              isChildActive
                                ? "bg-blue-500 text-white shadow-md"
                                : "text-gray-600 hover:text-blue-600"
                            )}
                            onClick={onClose}
                            title={child.description}
                          >
                            <child.icon className={cn(
                              "mr-3 h-4 w-4 flex-shrink-0 transition-all duration-300",
                              isChildActive 
                                ? "text-white" 
                                : "text-gray-400 group-hover:text-blue-500"
                            )} />
                            <span className="flex-1 text-left truncate font-medium">{child.name}</span>
                            {child.subscriptionRequired && (
                              <Badge variant="outline" className={cn(
                                "text-[9px] ml-2 flex-shrink-0 border transition-all duration-300",
                                isChildActive 
                                  ? "bg-white/20 text-white border-white/30" 
                                  : "bg-blue-50 text-blue-600 border-blue-200"
                              )}>
                                {child.subscriptionRequired}
                              </Badge>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
};

export default MobileSidebarNavigation;