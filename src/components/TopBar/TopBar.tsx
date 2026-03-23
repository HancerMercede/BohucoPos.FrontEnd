import styles from "./TopBar.module.css";
import { NAV_TABS } from "../../constants/design";
import type { TopBarProps } from "../../types";
import { useAuthStore } from "../../stores/authStore";

export function TopBar({ view, setView }: TopBarProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const visibleTabs = NAV_TABS.filter((tab: { id: string }) => {
    if (tab.id === 'products' || tab.id === 'manager') {
      return user?.role === 'Admin';
    }
    if (user?.role === 'Admin') {
      return tab.id === 'products' || tab.id === 'manager' || tab.id === 'overview';
    }
    return true;
  });

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <div className={styles.leftSection}>
          <div className={styles.logo}>🌿</div>
          <span className={styles.logoText}>
            BOHUCO<span className={styles.logoAccent}>POS</span>
          </span>
          <span className={styles.separator} />
          <span className={styles.badgeLabel}>Comandas</span>
        </div>

        <div className={styles.tabsWrapper}>
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              className={`nb ${view === tab.id ? "on" : ""}`}
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
          <span className={styles.separator} />
          {user && (
            <>
              <span className={styles.userName}>
                {user.fullName?.split(' ')[0] || 'Usuario'}
              </span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
