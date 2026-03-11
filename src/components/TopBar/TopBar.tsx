import styles from './TopBar.module.css';
import { NAV_TABS } from '../../constants/design';
import type { TopBarProps } from '../../types';

export function TopBar({ view, setView }: TopBarProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.leftSection}>
          <div className={styles.logo}>✦</div>
          <span className={styles.logoText}>
            BOHUCO<span className={styles.logoAccent}>POS</span>
          </span>
          <span className={styles.separator} />
          <span className={styles.badgeLabel}>Comandas</span>
        </div>
        
        <div className={styles.tabsWrapper}>
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nb ${view === tab.id ? 'on' : ''}`}
              onClick={() => setView(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className={styles.rightSection}>
          <div className={styles.signalDot} />
          <span className={styles.signalText}>SignalR live</span>
        </div>
      </div>
    </nav>
  );
}
