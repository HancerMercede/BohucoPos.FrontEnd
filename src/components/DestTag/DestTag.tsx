import styles from './DestTag.module.css';
import type { DestTagProps } from '../../types';

export function DestTag({ dest }: DestTagProps) {
  const isBar = dest === 'Bar';
  return (
    <span 
      className={styles.tag}
      style={{ 
        background: isBar ? 'rgba(139,92,246,.20)' : 'rgba(16,185,129,.18)',
        color: isBar ? '#A78BFA' : '#34D399',
        border: `1px solid ${isBar ? 'rgba(139,92,246,.35)' : 'rgba(16,185,129,.35)'}` 
      }}
    >
      {isBar ? '🍹 Bar' : '🍳 Cocina'}
    </span>
  );
}
