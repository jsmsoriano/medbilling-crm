import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MobileSidebarAccountInfo = () => {
  const { user } = useAuth();

  return (
    <div className="px-4 py-4 border-b bg-gray-50">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-gray-600" />
        <div>
          <div className="font-medium text-gray-900">{user?.email || 'User'}</div>
          <div className="text-sm text-gray-500">Admin</div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebarAccountInfo;