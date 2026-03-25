import type { TabDetailModalProps, Order, OrderItem } from '../../../types'
import { TAB_STATUS_COLORS, TAX_RATE } from '../../../constants/design'
import { DestTag } from '../../../components/DestTag'
import { getAuthHeaders } from '../../../utils/api'
import { useState } from 'react'
import { useOrderStore } from '../../../stores/orderStore'
import { API_URL } from '../../../config'
import styles from './TabDetailModal.module.css'

function OrderBlock({ order, index }: { order: Order; index: number }) {
  const cancelItem = useOrderStore(s => s.cancelItem)
  const [cancelling, setCancelling] = useState<number | null>(null)
  
  const activeItems = order.items.filter((i: OrderItem) => i.status !== 'Cancelled')
  const orderTotal = activeItems.reduce((sum, i) => sum + (i.price || i.unitPrice || 0) * (i.qty || i.quantity || 0), 0)
  
  const orderId = order.idDisplay || order.idDisplay || `ORD-${order.id}`
  const orderTime = order.createdAt ? new Date(order.createdAt).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }) : ''

  const handleRemoveItem = async (itemId: number) => {
    setCancelling(itemId)
    try {
      await cancelItem(itemId)
    } finally {
      setCancelling(null)
    }
  }

  return (
    <div className={styles.orderBlock} style={{ animationDelay: `${index * 0.06}s` }}>
      <div className={styles.orderHeader}>
        <span className={styles.orderId}>{orderId}</span>
        <span className={styles.orderTime}>{orderTime}</span>
        <span className={styles.orderSubtotal}>${orderTotal.toFixed(2)}</span>
      </div>
      <div className={styles.itemsList}>
        {order.items.map((item: OrderItem) => {
          if (item.status === 'Cancelled') return null
          
          return (
            <div key={item.id} className={styles.itemRow}>
              <span className={styles.itemQty}>×{item.qty || item.quantity}</span>
              <span className={styles.itemName}>{item.name || item.productName}</span>
              <DestTag dest={item.dest || 'Kitchen'} />
              {item.notes && (
                <span className={styles.itemNote}>📝 {item.notes}</span>
              )}
              <button 
                className={styles.removeBtn}
                onClick={() => handleRemoveItem(item.id)}
                disabled={cancelling === item.id}
                title="Eliminar item"
              >
                {cancelling === item.id ? '...' : '✕'}
              </button>
              <span className={styles.itemPrice}>
                ${(((item.price || item.unitPrice || 0) * (item.qty || item.quantity || 0))).toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TabDetailModal({ tab, table, onClose, onAddOrder, onRequestBill: _onRequestBill, onCloseTab, onRefreshTab }: TabDetailModalProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [billRequested, setBillRequested] = useState(false)
  
  const s = TAB_STATUS_COLORS[tab.status]
  const subtotal = tab.orders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + (i.price || i.unitPrice || 0) * (i.qty || i.quantity || 0), 0), 0
  )
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax
  const isOpen = tab.status === 'OPEN' || tab.status === 'Open'
  const isPending = tab.status === 'PENDING' || tab.status === 'Pending'

  const handleRequestBill = async () => {
    if (billRequested) return
    
    setBillRequested(true)
    setPdfLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/tabs/${tab.id}/pdf`, { headers: getAuthHeaders() })
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      }
    } catch (error) {
      console.error('Failed to load PDF:', error)
    } finally {
      setPdfLoading(false)
    }
  }

  const closePdf = async () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
      if (onRefreshTab) onRefreshTab()
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              {tab.customerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className={styles.title}>{tab.customerName}</h3>
              <p className={styles.subtitle}>
                {table.name} · Abierta {tab.openedAt ? new Date(tab.openedAt).toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' }) : ''}
              </p>
            </div>
          </div>
          <div className={styles.headerRight}>
            <span
              className={styles.statusBadge}
              style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
            >
              {s.label}
            </span>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.body}>
          {tab.orders.length === 0 ? (
            <div className={styles.empty}>
              <span>🧾</span>
              <p>Sin órdenes aún</p>
            </div>
          ) : (
            tab.orders.map((order, i) => (
              <OrderBlock key={order.id} order={order} index={i} />
            ))
          )}
        </div>

        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Subtotal</span>
            <span className={styles.totalValue}>${subtotal.toFixed(2)}</span>
          </div>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>ITBIS (18%)</span>
            <span className={styles.totalValue}>${tax.toFixed(2)}</span>
          </div>
          <div className={`${styles.totalRow} ${styles.totalFinal}`}>
            <span className={styles.totalLabelFinal}>TOTAL</span>
            <span className={styles.totalAmountFinal}>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.actions}>
          {isOpen && (
            <>
              <button className={styles.btnAddOrder} onClick={onAddOrder}>
                + Agregar Orden
              </button>
              <button
                className={styles.btnRequestBill}
                style={{ background: billRequested ? 'linear-gradient(135deg,#9CA3AF,#6B7280)' : 'linear-gradient(135deg,#F97316,#EA580C)', cursor: billRequested ? 'not-allowed' : 'pointer' }}
                onClick={handleRequestBill}
                disabled={billRequested}
              >
                {billRequested ? 'Cuenta Solicitada' : 'Pedir Cuenta'}
              </button>
              <button
                className={styles.btnClose}
                style={{ background: 'linear-gradient(135deg,#10B981,#059669)' }}
                onClick={() => onCloseTab?.('Card')}
              >
                Cerrar y Cobrar
              </button>
            </>
          )}
          {isPending && (
            <>
              <button
                className={styles.btnClose}
                style={{ background: 'linear-gradient(135deg,#10B981,#059669)', flex: 1 }}
                onClick={() => onCloseTab?.('Card')}
              >
                💳 Cobrar con Tarjeta
              </button>
              <button
                className={styles.btnClose}
                style={{ background: 'linear-gradient(135deg,#64748B,#475569)', flex: 1 }}
                onClick={() => onCloseTab?.('Cash')}
              >
                💵 Cobrar Efectivo
              </button>
            </>
          )}
        </div>

      </div>

      {(pdfUrl || pdfLoading) && (
        <div className={styles.pdfOverlay} onClick={closePdf}>
          <div className={styles.pdfModal} onClick={e => e.stopPropagation()}>
            <div className={styles.pdfHeader}>
              <span className={styles.pdfTitle}>Cuenta - {tab.customerName}</span>
              <button className={styles.pdfCloseBtn} onClick={closePdf}>✕</button>
            </div>
            <div className={styles.pdfContent}>
              {pdfLoading ? (
                <div className={styles.pdfLoading}>Cargando PDF...</div>
              ) : pdfUrl ? (
                <iframe src={pdfUrl} title="Bill PDF" className={styles.pdfFrame} />
              ) : null}
            </div>
          </div>
          <button className={styles.pdfFloatingClose} onClick={closePdf}>
            Cerrar y Proceder al Pago
          </button>
        </div>
      )}
    </div>
  )
}
