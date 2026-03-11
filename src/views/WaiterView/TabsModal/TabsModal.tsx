import type { TabsModalProps, Tab } from '../../../types'
import { TAB_STATUS_COLORS } from '../../../constants/design'
import styles from './TabsModal.module.css'

function calcTotal(tab: Tab): number {
  return tab.orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + (i.price || i.unitPrice || 0) * (i.qty || i.quantity || 0), 0), 0
  )
}

function TabRow({ tab, onView }: { tab: Tab; onView: () => void }) {
  const s = TAB_STATUS_COLORS[tab.status]
  const total = calcTotal(tab)
  const itemCount = tab.orders.reduce((sum, o) => sum + o.items.length, 0)

  return (
    <div className={styles.tabRow}>
      <div className={styles.tabRowLeft}>
        <div className={styles.avatar}>
          {tab.customerName.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className={styles.customerName}>{tab.customerName}</div>
          <div className={styles.tabMeta}>
            Abierta {tab.openedAt ? new Date(tab.openedAt).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }) : ''} · {itemCount} ítem{itemCount !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className={styles.tabRowRight}>
        <span
          className={styles.statusBadge}
          style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
        >
          {s.label}
        </span>
        <span className={styles.total}>${total.toFixed(2)}</span>
        <button className={styles.viewBtn} onClick={onView}>
          Ver →
        </button>
      </div>
    </div>
  )
}

export function TabsModal({ table, tabs, onViewTab, onNewTab, onClose }: TabsModalProps) {
  const isBar = table.type === 'bar'
  const totalAll = tabs.reduce((sum, t) => sum + calcTotal(t), 0)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>
              {isBar ? '🪑' : '🍽️'} {table.name}
            </h3>
            <p className={styles.subtitle}>
              {tabs.length} cuenta{tabs.length !== 1 ? 's' : ''} activa{tabs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {tabs.map(tab => (
            <TabRow
              key={tab.id}
              tab={tab}
              onView={() => onViewTab(tab)}
            />
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerTotal}>
            <span className={styles.footerTotalLabel}>Total acumulado</span>
            <span className={styles.footerTotalAmount}>${totalAll.toFixed(2)}</span>
          </div>
          <button className={styles.newTabBtn} onClick={onNewTab}>
            + Nueva cuenta
          </button>
        </div>

      </div>
    </div>
  )
}
