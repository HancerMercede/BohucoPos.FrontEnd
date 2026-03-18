import { useState, useMemo, useEffect } from 'react';
import { useOrderStore } from '../../stores/orderStore';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { DestTag } from '../../components/DestTag';
import { TableSelector } from './TableSelector';
import { OpenTabModal } from './OpenTabModal';
import { TabsModal } from './TabsModal';
import { TabDetailModal } from './TabDetailModal';
import styles from './WaiterView.module.css';
import type { MenuCategory, Tab, PaymentMethod } from '../../types';

const categories: MenuCategory[] = ['Todos', 'Platos', 'Entradas', 'Bebidas'];

type ModalType = 'openTab' | 'tabsList' | 'tabDetail' | null;

export function WaiterView() {
  const cart = useCartStore((s) => s.cart);
  const {
    tables,
    selectedTable,
    waiterStep,
    category,
    sent,
    isLoading,
    tabs,
    products,
    selectTable,
    goToMenu,
    goBackToTables,
    addToCart,
    updateCartQty,
    updateCartNote,
    setCategory,
    submitOrder,
    fetchTabsByLocation,
    openTab,
    requestBill,
    closeTab,
    selectedTab,
    setSelectedTab,
  } = useOrderStore();

  const { user } = useAuthStore();
  const waiterName = user?.fullName?.split(' ')[0] || 'Mesero';

  const [noteModal, setNoteModal] = useState<{ id: string; note: string } | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const tabsByTable = useMemo(() => {
    const result: Record<string, Tab[]> = {};
    tabs.forEach(tab => {
      const tableId = tables.find(t => t.name === tab.location)?.id;
      if (tableId) {
        if (!result[tableId]) result[tableId] = [];
        result[tableId].push(tab);
      }
    });
    return result;
  }, [tabs, tables]);

  const filteredItems = useMemo(() => {
    return category === 'Todos' ? products : products.filter(m => m.category === category);
  }, [category]);

  const total = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);

  const handleSend = () => {
    submitOrder(waiterName);
  };

  const handleOpenTab = async (customerName: string) => {
    if (selectedTable) {
      await openTab(selectedTable.name, customerName || 'Cliente', waiterName, waiterName);
      setActiveModal(null);
      goToMenu(selectedTable);
    }
  };

  const handleCloseTab = async (paymentMethod: PaymentMethod) => {
    if (selectedTab) {
      await closeTab(selectedTab.id, paymentMethod, false);
      setActiveModal(null);
    }
  };

  const handleRequestBill = async () => {
    if (selectedTab) {
      await requestBill(selectedTab.id);
    }
  };

  useEffect(() => {
    fetchTabsByLocation('');
  }, [fetchTabsByLocation]);

  if (sent) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <div className={styles.successTitle}>¡Orden Enviada!</div>
        <div className={styles.successSubtitle}>Notificando cocina y barra en tiempo real...</div>
      </div>
    );
  }

  if (waiterStep === 'tables') {
    return (
      <>
        <TableSelector
          tables={tables}
          tabsByTable={tabsByTable}
          onSelectFree={(table) => {
            selectTable(table);
            setActiveModal('openTab');
          }}
          onSelectOccupied={(table) => {
            selectTable(table);
            setActiveModal('tabsList');
          }}
        />

        {activeModal === 'openTab' && selectedTable && (
          <OpenTabModal
            table={selectedTable}
            onConfirm={handleOpenTab}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'tabsList' && selectedTable && (
          <TabsModal
            table={selectedTable}
            tabs={tabs.filter(t => t.location === selectedTable.name)}
            onViewTab={(tab) => {
              setSelectedTab(tab);
              setActiveModal('tabDetail');
            }}
            onNewTab={() => setActiveModal('openTab')}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'tabDetail' && selectedTab && selectedTable && (
          <TabDetailModal
            tab={selectedTab}
            table={selectedTable}
            onClose={() => setActiveModal('tabsList')}
            onAddOrder={() => {
              if (selectedTable) {
                goToMenu(selectedTable);
              }
              setActiveModal(null);
            }}
            onRequestBill={handleRequestBill}
            onCloseTab={handleCloseTab}
          />
        )}
      </>
    );
  }

  return (
    <div className={styles.menuContainer}>
      <div className={styles.menuPanel}>
        <div className={styles.menuHeader}>
          <button className={styles.backBtn} onClick={() => goBackToTables()}>
            ← Volver
          </button>
          <h2 className={styles.menuTitle}>
            {selectedTable?.name}
            {selectedTab ? ` — ${selectedTab.customerName}` : ' — Nueva Orden'}
          </h2>
        </div>
        
        <div className={styles.categories}>
          {categories.map(c => (
            <button
              key={c}
              className={`pill ${category === c ? 'on' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className={styles.productsGrid}>
          {filteredItems.map((item, i) => {
            const inCart = cart.find(c => c.id === item.id);
            return (
              <div
                key={item.id}
                className={`mi ${inCart ? 'sel' : ''}`}
                style={{ animationDelay: `${i * 0.04}s` } as React.CSSProperties}
                onClick={() => addToCart(item)}
              >
                <div className={styles.productEmoji}>{item.emoji}</div>
                <div className={styles.productName}>{item.name}</div>
                <div className={styles.productRow} style={{ marginBottom: inCart ? 8 : 0 }}>
                  <span className={styles.productPrice}>${item.price.toFixed(2)}</span>
                  <DestTag dest={item.dest} />
                </div>
                {inCart && (
                  <div className={styles.inCartBadge}>
                    <span className={styles.inCartLabel}>En orden</span>
                    <span className={styles.inCartQty}>×{inCart.qty}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.cartPanel}>
        <div className={styles.cartHeader}>
          <div className={styles.cartTitle}>Orden</div>
          <div className={styles.cartSubtitle}>{selectedTable?.name}</div>
        </div>
        
        <div className={styles.cartBody}>
          {cart.length === 0 ? (
            <div className={styles.cartEmpty}>
              <div className={styles.cartEmptyIcon}>🛒</div>
              Agrega productos al menú
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.cartItemRow}>
                  <div className={styles.cartItemInfo}>
                    <div className={styles.cartItemName}>{item.name}</div>
                    <DestTag dest={item.dest} />
                    {item.notes && <div className={styles.cartItemNotes}>📝 {item.notes}</div>}
                  </div>
                  <span className={styles.cartItemTotal}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div className={styles.cartItemActions}>
                  <div className={styles.qtyControls}>
                    <button className={styles.qtyBtn} onClick={() => updateCartQty(item.id, -1)}>−</button>
                    <span className={styles.qtyValue}>{item.qty}</span>
                    <button className={styles.qtyBtn} onClick={() => updateCartQty(item.id, 1)}>+</button>
                  </div>
                  <button className={styles.noteBtn} onClick={() => setNoteModal({ id: item.id, note: item.notes })}>
                    + nota
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.cartFooter}>
          <div className={styles.cartTotalRow}>
            <span className={styles.cartTotalLabel}>Total</span>
            <span className={styles.cartTotalAmount}>${total.toFixed(2)}</span>
          </div>
          <button 
            className={styles.sendBtn}
            onClick={handleSend}
            disabled={cart.length === 0 || isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar Orden →'}
          </button>
        </div>
      </div>

      {noteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalTitle}>Agregar nota</div>
            <textarea
              className={styles.modalInput}
              value={noteModal.note}
              onChange={(e) => setNoteModal({ ...noteModal, note: e.target.value })}
              placeholder="ej: sin cebolla, extra picante..."
              autoFocus
            />
            <div className={styles.modalButtons}>
              <button className={styles.modalCancel} onClick={() => setNoteModal(null)}>Cancelar</button>
              <button 
                className={styles.modalSave} 
                onClick={() => { updateCartNote(noteModal.id, noteModal.note); setNoteModal(null); }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
