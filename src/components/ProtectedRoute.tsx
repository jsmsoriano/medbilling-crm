
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isBypassed } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && !isBypassed) {
      navigate('/auth');
    }
  }, [user, loading, isBypassed, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !isBypassed) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
