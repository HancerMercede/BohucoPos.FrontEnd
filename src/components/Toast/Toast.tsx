import { useNotificationStore } from '../../stores/notificationStore';
import styles from './Toast.module.css';

export function Toast() {
  const notification = useNotificationStore((s) => s.notification);
  
  if (!notification) return null;
  
  return (
    <div className={`${styles.toast} ${styles[notification.type]}`}>
      {notification.message}
    </div>
  );
}
