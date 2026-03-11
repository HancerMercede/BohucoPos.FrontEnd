import styles from './Badge.module.css';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/design';
import type { BadgeProps } from '../../types';

export function Badge({ status }: BadgeProps) {
  const statusStr = typeof status === 'string' ? status : String(status);
  const s = STATUS_COLORS[statusStr.toLowerCase()];
  const label = STATUS_LABELS[statusStr] ?? statusStr;
  
  return (
    <span
      className={styles.badge}
      style={{ 
        background: s?.bg, 
        border: `1px solid ${s?.border}`, 
        color: s?.text 
      }}
    >
      {label}
    </span>
  );
}
