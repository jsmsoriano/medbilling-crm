import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const MobileSidebarFooter = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
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
  );
};

export default MobileSidebarFooter;