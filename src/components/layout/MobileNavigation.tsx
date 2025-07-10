
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { getFilteredNavigation } from '@/config/navigation';

interface MobileNavigationProps {
  onItemClick?: () => void;
}

const MobileNavigation = ({ onItemClick }: MobileNavigationProps) => {
  const location = useLocation();
  const { subscriptionTier } = useSubscription();

  // Get filtered navigation based on user's subscription
  const navigationGroups = getFilteredNavigation(subscriptionTier);

  const handleItemClick = () => {
    if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 truncate">Navigation</h2>
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
              const isChildActive = hasChildren && item.children?.some(child => location.pathname === child.href);
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={handleItemClick}
                  className={cn(
                    "group flex items-center px-3 py-4 text-base font-medium rounded-lg transition-colors min-h-[48px] touch-manipulation",
                    isActive || isChildActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/80"
                  )}
                  title={item.description}
                >
                  <item.icon className="mr-4 h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.name}</span>
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
    </div>
  );
};

export default MobileNavigation;
