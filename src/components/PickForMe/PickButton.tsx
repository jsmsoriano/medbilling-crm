
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface PickButtonProps {
  loading: boolean;
  onSubmit: () => void;
}

const PickButton = ({ loading, onSubmit }: PickButtonProps) => {
  return (
    <Button 
      type="submit" 
      className="w-full bg-filipino-red hover:bg-filipino-red/90"
      disabled={loading}
      onClick={onSubmit}
    >
      {loading ? 'Finding the perfect spot...' : 'Pick For Me!'}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default PickButton;
