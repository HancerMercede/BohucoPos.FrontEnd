import type { Tab } from '../../types';
import styles from './TabList.module.css';

interface TabListProps {
  tabs: Tab[];
  location: string;
  onSelectTab: (tab: Tab) => void;
  onNewTab: () => void;
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
};

export const TabList = ({ tabs, location, onSelectTab, onNewTab }: TabListProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{location} — {tabs.length} cuenta{tabs.length !== 1 ? 's' : ''}</h2>
      </div>

      <div className={styles.list}>
        {tabs.map((tab) => (
          <button key={tab.id} className={styles.tabCard} onClick={() => onSelectTab(tab)}>
            <div className={styles.tabInfo}>
              <span className={styles.customerName}>👤 {tab.customerName || 'Sin nombre'}</span>
              <span className={styles.time}>Abierta: {formatTime(tab.openedAt)}</span>
            </div>
            <div className={styles.tabTotal}>
              <span className={`${styles.status} ${styles[tab.status.toLowerCase()]}`}>
                {tab.status}
              </span>
              <span className={styles.amount}>{formatCurrency(tab.total)}</span>
            </div>
          </button>
        ))}
      </div>

      <button className={styles.newTabBtn} onClick={onNewTab}>
        + Nueva cuenta
      </button>
    </div>
  );
};
