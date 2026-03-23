import { useEffect, useMemo, useCallback, useState } from 'react';
import { useOrderStore } from '../../stores/orderStore';
import { Badge } from '../../components/Badge';
import { DISPLAY_CONFIG, NEXT_STATUS, ACTION_LABELS } from '../../constants/design';
import styles from './DisplayView.module.css';
import type { DisplayViewProps, ItemStatus } from '../../types';

export function DisplayView({ dest }: DisplayViewProps) {
  const config = DISPLAY_CONFIG[dest];
  const { orders, fetchPendingOrders, updateOrderItemStatus, loadSignalR } = useOrderStore();

  useEffect(() => {
    loadSignalR();
    fetchPendingOrders(dest, true);
  }, [dest, fetchPendingOrders, loadSignalR]);

  const [cancelledItems, setCancelledItems] = useState<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const filteredOrders = useMemo(() => orders
    .map(o => ({ 
      ...o, 
      items: o.items?.filter(i => {
        const isDestMatch = i.dest === dest || i.destination === dest;
        const statusStr = typeof i.status === 'string' ? i.status : (i.status === 3 ? 'Delivered' : '');
        const isNotDelivered = statusStr !== 'Delivered';
        return isDestMatch && isNotDelivered;
      }) || [] 
    }))
    .filter(o => o.items?.length > 0), [orders, dest]);

  const ordersWithCancelled = useMemo(() => {
    return filteredOrders.map(o => ({
      ...o,
      items: o.items?.map(i => {
        if (i.status === 'Cancelled' && !cancelledItems.has(i.id)) {
          const timeout = setTimeout(() => {
            setCancelledItems(prev => {
              const next = new Map(prev);
              next.delete(i.id);
              return next;
            });
          }, 10000);
          setCancelledItems(prev => new Map(prev).set(i.id, timeout));
        }
        return i;
      }).filter(i => {
        if (i.status === 'Cancelled') {
          return cancelledItems.has(i.id);
        }
        return true;
      })
    })).filter(o => o.items?.length > 0);
  }, [filteredOrders, cancelledItems]);

  const updateStatus = useCallback((orderId: string | number, itemId: number, newStatus: ItemStatus) => {
    updateOrderItemStatus(String(orderId), itemId, newStatus);
  }, [updateOrderItemStatus]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div 
          className={styles.headerIcon}
          style={{ background: config.accentGrad, boxShadow: `0 8px 22px ${config.accentGlow}` }}
        >
          {config.icon}
        </div>
        <div>
          <h2 className={styles.headerTitle}>
            {config.title}
          </h2>
          <p className={styles.headerSubtitle}>
            Actualización en tiempo real · SignalR
          </p>
        </div>
        <div className={styles.activeCount}>
          <span className={styles.activeCountValue} style={{ color: config.accentColor }}>
            {ordersWithCancelled.length}
          </span>
          <span className={styles.activeCountLabel}>órdenes activas</span>
        </div>
      </div>

      <div className={styles.grid}>
        {ordersWithCancelled.map((order, oi) => {
          const orderItems = order.items || [];
          const allDone = orderItems.every(i => i.status === 'Ready' || i.status === 'Delivered');
          const createdAt = order.createdAt ? new Date(order.createdAt) : new Date();
          const elapsed = Math.floor((Date.now() - createdAt.getTime()) / 60000);
          const urgent = elapsed > 10;

          return (
            <div
              key={order.id}
              className={`oc ${urgent ? 'urgent' : ''} ${allDone ? 'done' : ''}`}
              style={{ animationDelay: `${oi * 0.08}s` } as React.CSSProperties}
            >
              <div 
                className={styles.cardHeader}
                style={{
                  background: urgent ? 'rgba(239,68,68,.10)' : allDone ? 'rgba(16,185,129,.10)' : 'rgba(255,255,255,.04)',
                }}
              >
                <div>
                  <div className={styles.cardTitle}>
                    {order.table || order.tableId || 'Sin mesa'}
                  </div>
                  <div className={styles.cardMeta}>
                    #{order.idDisplay || order.id} · {order.waiterName || order.waiter}
                  </div>
                </div>
                <div className={styles.cardTime}>
                  <div className={styles.cardTimeValue} style={{ color: urgent ? '#EF4444' : config.accentColor }}>
                    {elapsed}m
                  </div>
                  <div className={styles.cardTimeLabel}>
                    {createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <div className={styles.cardBody}>
                {orderItems.map(item => {
                  const statusKey = typeof item.status === 'string' ? item.status : String(item.status);
                  const borderColor = statusKey === 'Pending' ? 'rgba(249,115,22,0.40)' :
                                     statusKey === 'Preparing' ? 'rgba(59,130,246,0.40)' :
                                     statusKey === 'Ready' ? 'rgba(16,185,129,0.40)' :
                                     statusKey === 'Cancelled' ? 'rgba(239,68,68,0.60)' :
                                     'rgba(255,255,255,0.10)';
                  const isCancelled = statusKey === 'Cancelled';
                  return (
                    <div
                      key={item.id}
                      className={styles.itemCard}
                      style={{ 
                        borderColor,
                        background: isCancelled ? 'rgba(239,68,68,0.08)' : undefined,
                        opacity: isCancelled ? 0.7 : undefined
                      }}
                    >
                      <div className={styles.itemRow} style={{ marginBottom: item.notes ? 4 : 8 }}>
                        <span className={styles.itemText}>
                          ×{item.quantity || item.qty} {item.productName || item.name}
                        </span>
                        <Badge status={item.status} />
                      </div>
                      {item.notes && (
                        <div className={styles.itemNotes}>
                          📝 {item.notes}
                        </div>
                      )}
                      {item.status !== 'Delivered' && item.status !== 'Cancelled' && (
                        <button
                          className="abtn"
                          onClick={() => {
                            const next = NEXT_STATUS[item.status];
                            if (next) updateStatus(order.id, item.id, next as ItemStatus);
                          }}
                          style={{
                            background: item.status === 'Pending' 
                              ? 'linear-gradient(135deg,#3B82F6,#6366F1)'
                              : item.status === 'Preparing'
                              ? config.accentGrad
                              : 'linear-gradient(135deg,#64748B,#475569)',
                            color: '#fff',
                            boxShadow: `0 4px 14px ${config.accentGlow}`,
                          }}
                        >
                          {ACTION_LABELS[item.status]}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
