import { useState } from 'react';
import type { Tab, PaymentMethod } from '../../types';
import styles from './TabDetail.module.css';

interface TabDetailProps {
  tab: Tab;
  onBack: () => void;
  onAddOrder: () => void;
  onRequestBill: () => void;
  onClose: (paymentMethod: PaymentMethod, direct: boolean) => void;
  onCancel: (reason?: string) => void;
}

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: 'DOP' }).format(amount);
};

export const TabDetail = ({ tab, onBack, onAddOrder, onRequestBill, onClose, onCancel }: TabDetailProps) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [directClose, setDirectClose] = useState(false);

  const handleClose = (method: PaymentMethod) => {
    onClose(method, directClose);
    setShowPaymentModal(false);
  };

  const handleCancel = () => {
    onCancel(cancelReason || undefined);
    setShowCancelModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          ← Volver
        </button>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{tab.location} — {tab.customerName || 'Sin nombre'}</h2>
          <span className={`${styles.status} ${styles[tab.status.toLowerCase()]}`}>
            {tab.status}
          </span>
        </div>
        <p className={styles.meta}>
          Mesero: {tab.waiterName} | Abierta: {formatTime(tab.openedAt)}
        </p>
      </div>

      <div className={styles.orders}>
        {tab.orders.map((order) => (
          <div key={order.id} className={styles.order}>
            <div className={styles.orderHeader}>
              <span className={styles.orderId}>ORDEN #{order.id}</span>
              <span className={styles.orderTime}>{formatTime(order.createdAt)}</span>
            </div>
            {order.items.map((item) => (
              <div key={item.id} className={styles.item}>
                <span className={styles.itemQty}>×{(item.qty || item.quantity)}</span>
                <span className={styles.itemName}>{item.productName}</span>
                <span className={styles.itemPrice}>
                  {formatCurrency((item.unitPrice || 0) * (item.qty || item.quantity || 0))}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.totals}>
        <div className={styles.totalRow}>
          <span>Subtotal</span>
          <span>{formatCurrency(tab.subtotal)}</span>
        </div>
        <div className={styles.totalRow}>
          <span>ITBIS (18%)</span>
          <span>{formatCurrency(tab.tax)}</span>
        </div>
        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
          <span>Total</span>
          <span>{formatCurrency(tab.total)}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.addOrderBtn} onClick={onAddOrder}>
          + Agregar Orden
        </button>
        
        {tab.status === 'Open' && (
          <button className={styles.requestBillBtn} onClick={onRequestBill}>
            Pedir la Cuenta
          </button>
        )}
        
        {tab.status === 'Pending' && (
          <button className={styles.requestBillBtn} onClick={onRequestBill}>
            Seguir Ordenando
          </button>
        )}
        
        {(tab.status === 'Open' || tab.status === 'Pending') && (
          <button className={styles.closeBtn} onClick={() => setShowPaymentModal(true)}>
            Cerrar y Cobrar
          </button>
        )}
        
        <button className={styles.cancelBtn} onClick={() => setShowCancelModal(true)}>
          Cancelar Cuenta
        </button>
      </div>

      {showPaymentModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Método de Pago</h3>
            
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={directClose}
                onChange={(e) => setDirectClose(e.target.checked)}
              />
              Cerrar directamente (sin pasar por "pedir cuenta")
            </label>

            <div className={styles.paymentButtons}>
              <button className={styles.paymentBtn} onClick={() => handleClose('Cash')}>
                💵 Efectivo
              </button>
              <button className={styles.paymentBtn} onClick={() => handleClose('Card')}>
                💳 Tarjeta
              </button>
              <button className={styles.paymentBtn} onClick={() => handleClose('Transfer')}>
                📱 Transferencia
              </button>
            </div>

            <button className={styles.modalCancelBtn} onClick={() => setShowPaymentModal(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Cancelar Cuenta</h3>
            
            <textarea
              className={styles.reasonInput}
              placeholder="Motivo de cancelación (opcional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
            />

            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={() => setShowCancelModal(false)}>
                Mantener
              </button>
              <button className={styles.confirmCancelBtn} onClick={handleCancel}>
                Cancelar Cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
