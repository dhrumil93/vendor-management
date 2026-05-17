import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center">
            <MapPin size={36} className="text-primary" />
          </div>
        </div>
        <h1 className="text-6xl font-extrabold text-gray-200 mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Page not found</h2>
        <p className="text-sm text-gray-500 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Button
          onClick={() => {
            void navigate('/dashboard');
          }}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
