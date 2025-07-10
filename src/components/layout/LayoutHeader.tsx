
import { Link } from 'react-router-dom';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubscriptionBadge } from '@/components/ui/subscription-badge';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LayoutHeaderProps {
  onMobileMenuToggle: () => void;
}

const LayoutHeader = ({ onMobileMenuToggle }: LayoutHeaderProps) => {
  const { signOut, user } = useAuth();
  const { subscriptionTier } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50 w-full max-w-full">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 w-full max-w-full">
        {/* Left side - Logo and Menu Button */}
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/lovable-uploads/98e62fe8-89f3-4c17-82c9-a872ff6e2d36.png"
              alt="Excel Medical Billing"
              className="h-10 w-auto"
            />
            <div className="hidden lg:flex flex-col">
              <span className="text-sm font-medium text-gray-900">Excel Medical Billing</span>
              <SubscriptionBadge showIcon={false} className="text-xs self-start" />
            </div>
          </Link>
        </div>

        {/* Right side - Only Bell, Account Icon, and Settings */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white z-50">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <span>My Account</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                  <SubscriptionBadge className="self-start" />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;
