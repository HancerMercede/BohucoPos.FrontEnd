import { useOrderStore } from '../../stores/orderStore';
import styles from './Toast.module.css';

export function Toast() {
  const notification = useOrderStore((s: any) => s.notification);
  
  if (!notification) return null;
  
  return (
    <div className={`${styles.toast} ${styles[notification.type]}`}>
      {notification.message}
    </div>
  );
}
