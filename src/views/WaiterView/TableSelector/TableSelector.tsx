import type { TableSelectorProps, TableItem, Tab } from '../../../types'
import styles from './TableSelector.module.css'

function getTableState(table: TableItem, tabs: Tab[] = []) {
  if (table.status === 'free') return 'free'
  if (tabs.length === 0) return 'occupied'
  if (table.status === 'occupied' || table.status === 'has-tabs') return 'occupied'
  const allPending = tabs.every(t => t.status === 'PENDING')
  if (allPending) return 'pending'
  return 'occupied'
}

function TableCard({
  table, tabs, onSelectFree, onSelectOccupied, index
}: {
  table: TableItem
  tabs: Tab[]
  onSelectFree: (t: TableItem) => void
  onSelectOccupied: (t: TableItem) => void
  index: number
}) {
  const state = getTableState(table, tabs)
  const isBar = table.type === 'bar'

  const handleClick = () => {
    if (state === 'free') onSelectFree(table)
    else onSelectOccupied(table)
  }

  return (
    <button
      className={`${styles.card} ${styles[state]}`}
      onClick={handleClick}
      style={{ animationDelay: `${index * 0.05}s` }}
      disabled={false}
    >
      <span className={`${styles.dot} ${styles[`dot_${state}`]}`} />
      <div className={styles.icon}>
        {isBar ? '🪑' : '🍽️'}
      </div>
      <div className={styles.name}>{table.name}</div>
      <div className={`${styles.statusLabel} ${styles[`label_${state}`]}`}>
        {state === 'free'     && '● Libre'}
        {state === 'occupied' && `● ${tabs.length} cuenta${tabs.length > 1 ? 's' : ''}`}
        {state === 'pending'  && '● Esperando pago'}
      </div>
      {tabs.length > 0 && (
        <div className={styles.tabCount}>{tabs.length}</div>
      )}
    </button>
  )
}

export function TableSelector({
  tables,
  tabsByTable,
  onSelectFree,
  onSelectOccupied,
}: TableSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Seleccionar Mesa</h2>
        <p className={styles.subtitle}>Toca una mesa disponible para abrir una cuenta</p>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendFree}`} /> Libre
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendOccupied}`} /> Con cuentas
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendPending}`} /> Esperando pago
        </span>
      </div>

      <div className={styles.grid}>
        {tables.map((table, i) => (
          <TableCard
            key={table.id}
            table={table}
            tabs={tabsByTable[table.id] ?? []}
            onSelectFree={onSelectFree}
            onSelectOccupied={onSelectOccupied}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
