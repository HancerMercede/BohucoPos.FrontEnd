import { useEffect, useMemo } from 'react';
import { useOrderStore } from '../../stores/orderStore';
import { Badge } from '../../components/Badge';
import styles from './OverviewView.module.css';

const statsData = [
  { label: 'Órdenes Activas', value: 0, icon: '📋', grad: 'linear-gradient(135deg,#3B82F6,#6366F1)', glow: 'rgba(59,130,246,.35)' },
  { label: 'Ítems en Cocina', value: 0, icon: '🍳', grad: 'linear-gradient(135deg,#10B981,#059669)', glow: 'rgba(16,185,129,.35)' },
  { label: 'Ítems en Barra', value: 0, icon: '🍹', grad: 'linear-gradient(135deg,#8B5CF6,#6366F1)', glow: 'rgba(139,92,246,.35)' },
  { label: 'Listos p/ entregar', value: 0, icon: '✅', grad: 'linear-gradient(135deg,#F97316,#EF4444)', glow: 'rgba(249,115,22,.35)' },
];

export function OverviewView() {
  const { orders, fetchPendingOrders, clearOrders } = useOrderStore();

  useEffect(() => {
    // Fetch orders for both Kitchen and Bar when entering Overview
    clearOrders();
    fetchPendingOrders('Kitchen', true).then(() => {
      fetchPendingOrders('Bar', false);
    });
  }, [fetchPendingOrders, clearOrders]);

  const stats = useMemo(() => {
    const allItems = orders.flatMap(o => o.items || []);
    const kitchenItems = allItems.filter(i => i.dest === 'Kitchen').length;
    const barItems = allItems.filter(i => i.dest === 'Bar').length;
    const readyItems = allItems.filter(i => {
      const s = typeof i.status === 'number' ? i.status : (i.status === 'Ready' ? 2 : -1);
      return s === 2;
    }).length;
    
    return [
      { ...statsData[0], value: orders.length },
      { ...statsData[1], value: kitchenItems },
      { ...statsData[2], value: barItems },
      { ...statsData[3], value: readyItems },
    ];
  }, [orders]);

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h2 className={styles.pageTitle}>Resumen en Tiempo Real</h2>
        <p className={styles.pageSubtitle}>Actualizado vía SignalR WebSocket</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={styles.statCard}
            style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}
          >
            <div
              className={styles.statIcon}
              style={{
                background: stat.grad,
                boxShadow: `0 8px 22px ${stat.glow}`,
              }}
            >
              {stat.icon}
            </div>
            <div className={styles.statValue}>
              {stat.value}
            </div>
            <div className={styles.statLabel}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Órdenes Activas</span>
          <div className={styles.liveIndicator}>
            <div className={styles.liveDot} />
            <span className={styles.liveText}>en vivo</span>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHead}>
              {['Orden', 'Mesa', 'Mesero', 'Items', 'Cocina', 'Barra', 'Tiempo', 'Estado'].map(h => (
                <th key={h} className={styles.tableTh}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => {
              const items = order.items || [];
              const ki = items.filter(x => x.dest === 'Kitchen');
              const bi = items.filter(x => x.dest === 'Bar');
              const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
              const elapsed = Math.floor((Date.now() - createdAt.getTime()) / 60000);
              
              const getReadyCount = (items: typeof ki) => 
                items.filter(x => {
                  const s = typeof x.status === 'number' ? x.status : (x.status === 'Ready' ? 2 : -1);
                  return s === 2;
                }).length;
              
              return (
                <tr 
                  key={order.id} 
                  className={styles.tableRow}
                  style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,.025)' } as React.CSSProperties}
                >
                  <td className={`${styles.tableCell} ${styles.cellId}`}>
                    {order.idDisplay || order.id}
                  </td>
                  <td className={`${styles.tableCell} ${styles.cellTable}`}>
                    {order.table || order.tableId || 'Sin mesa'}
                  </td>
                  <td className={`${styles.tableCell} ${styles.cellWaiter}`}>
                    {order.waiterName || order.waiter}
                  </td>
                  <td className={`${styles.tableCell} ${styles.cellItems}`}>
                    {items.length}
                  </td>
                  <td className={`${styles.tableCell} ${styles.cellKitchen}`}>
                    {getReadyCount(ki)}/{ki.length} listos
                  </td>
                  <td className={`${styles.tableCell} ${styles.cellBar}`}>
                    {getReadyCount(bi)}/{bi.length} listos
                  </td>
                  <td className={`${styles.tableCell} ${styles.cellTime}`}>
                    <span className={elapsed > 10 ? styles.timeUrgent : ''}>
                      {elapsed}m
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <Badge status={order.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
