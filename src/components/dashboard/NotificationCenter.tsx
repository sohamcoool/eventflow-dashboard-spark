import React from 'react';
import { AlertTriangle, Clock, Info, X, Eye } from 'lucide-react';

interface Notification {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  eventId?: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
  onNotificationDismiss: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'error':
      return AlertTriangle;
    case 'warning':
      return Clock;
    default:
      return Info;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'error':
      return 'border-destructive/20 bg-destructive/5 text-destructive';
    case 'warning':
      return 'border-warning/20 bg-warning/5 text-warning';
    default:
      return 'border-primary/20 bg-primary/5 text-primary';
  }
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onNotificationRead,
  onNotificationDismiss,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="space-y-4 animate-slide-down">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Active Notifications ({notifications.length})
        </h3>
      </div>

      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const Icon = getNotificationIcon(notification.type);
          const colorClass = getNotificationColor(notification.type);

          return (
            <div
              key={notification.id}
              className={`
                border rounded-xl p-4 transition-all duration-300 hover:shadow-md
                ${colorClass} animate-slide-in-left stagger-delay-${index + 1}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onNotificationRead(notification.id)}
                          className="text-xs px-3 py-1 bg-muted hover:bg-muted/80 rounded-full transition-colors duration-200 flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Mark as Read
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onNotificationDismiss(notification.id)}
                  className="p-1 hover:bg-muted/50 rounded-lg transition-colors duration-200 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationCenter;