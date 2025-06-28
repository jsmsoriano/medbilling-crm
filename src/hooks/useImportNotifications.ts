
import { useState } from 'react';

export interface ImportNotification {
  id: string;
  message: string;
  type: 'progress' | 'success' | 'error';
  progress?: number;
}

export const useImportNotifications = () => {
  const [notifications, setNotifications] = useState<ImportNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const addNotification = (message: string, type: 'progress' | 'success' | 'error', progress?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification = { id, message, type, progress };
    setNotifications(prev => [notification, ...prev]);
    setShowNotifications(true);
    
    // Auto-remove success/error notifications after 5 seconds
    if (type !== 'progress') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    }
    
    return id;
  };

  const updateNotification = (id: string, message: string, type: 'progress' | 'success' | 'error', progress?: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, message, type, progress } : n));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  return {
    notifications,
    showNotifications,
    addNotification,
    updateNotification,
    removeNotification,
    closeNotifications,
  };
};
