
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export interface ImportNotification {
  id: string;
  message: string;
  type: 'progress' | 'success' | 'error';
  progress?: number;
}

interface ImportNotificationsProps {
  notifications: ImportNotification[];
  showNotifications: boolean;
  onClose: () => void;
  onRemoveNotification: (id: string) => void;
}

const ImportNotifications = ({ 
  notifications, 
  showNotifications, 
  onClose, 
  onRemoveNotification 
}: ImportNotificationsProps) => {
  if (!showNotifications || notifications.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4" />
            Import Notifications
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {notifications.map((notification) => (
          <div key={notification.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {notification.type === 'progress' && <AlertCircle className="h-4 w-4 text-blue-600" />}
                {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                <span className="text-sm">{notification.message}</span>
              </div>
              {notification.type !== 'progress' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveNotification(notification.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {notification.type === 'progress' && typeof notification.progress === 'number' && (
              <Progress value={notification.progress} className="h-2" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ImportNotifications;
