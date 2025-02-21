import { useState, useEffect } from 'react';
import { Notification, notificationStore } from '../utils/notificationStore';
import { Card } from './ui/Card';

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = notificationStore.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: Notification['type']) => {
    const icons = {
      warning: 'bi bi-exclamation-triangle-fill text-warning',
      danger: 'bi bi-x-octagon-fill text-danger',
      success: 'bi bi-check-circle-fill text-success',
      info: 'bi bi-info-circle-fill text-info',
    };
    return icons[type] || icons.info;
  };

  const handleToggle = () => setIsOpen(!isOpen);

  const handleMarkAllRead = () => {
    notifications.forEach(n => notificationStore.markAsRead(n.id.toString()));
  };

  const handleMarkRead = (id: string) => {
    notificationStore.markAsRead(id);
  };

  return (
    <div className="notifications-wrapper position-absolute" style={{ right: '40px', top: '40px' }}>
      <button 
        className="btn btn-link position-relative p-2"
        onClick={handleToggle}
      >
        <i className="bi bi-bell-fill fs-5 text-secondary"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="position-absolute end-0 mt-2 notification-dropdown" style={{ width: '400px', zIndex: 1050 }}>
          <Card title="Notifications">
            <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Notifications</h6>
              {notifications.length > 0 && (
                <button 
                  className="btn btn-link btn-sm text-decoration-none"
                  onClick={handleMarkAllRead}
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-bell-slash fs-4 text-muted"></i>
                  <p className="text-muted mt-2">No notifications</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`list-group-item list-group-item-action ${!notification.read ? 'bg-light' : ''}`}
                      onClick={() => handleMarkRead(notification.id.toString())}
                      role="button"
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <i className={`${getIcon(notification.type)} fs-5`}></i>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <p className="mb-1 text-body-secondary">{notification.message}</p>
                          <small className="text-muted d-flex align-items-center">
                            <i className="bi bi-clock me-1"></i>
                            {notification.timestamp.toLocaleTimeString()}
                          </small>
                        </div>
                        {!notification.read && (
                          <span className="flex-shrink-0 ms-2">
                            <span className="badge rounded-pill bg-primary">New</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {notifications.length > 0 && (
              <div className="card-footer bg-white border-top-0 text-center">
                <button className="btn btn-link btn-sm text-decoration-none">
                  View All Notifications
                </button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

