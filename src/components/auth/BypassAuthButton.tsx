
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TestTube } from 'lucide-react';

interface BypassAuthButtonProps {
  onBypass: () => void;
  loading: boolean;
}

const BypassAuthButton = ({ onBypass, loading }: BypassAuthButtonProps) => {
  const handleBypassLogin = () => {
    toast.success('Bypassing authentication for testing');
    onBypass();
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <Button
        variant="ghost"
        onClick={handleBypassLogin}
        className="w-full text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50"
        disabled={loading}
      >
        <TestTube className="mr-2 h-4 w-4" />
        Bypass Login (Testing Only)
      </Button>
    </div>
  );
};

export default BypassAuthButton;
